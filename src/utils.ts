import policyConfigFile from "@/policyConfig.json"
import { PolicyTree, PolicyTreeNode, FileSystemObj, PolicyConfig, BackupFiles } from "@/types"

export const DOLLAR_YEN_RATE = policyConfigFile.dollarToYen

export const humanReadableSize = (size: number) => {
  if (size === 0) return "0.00 B"
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB", "TB", "PB"][i]}`
}

export const pathBasename = (path: string) => {
  return path.split("/").pop()
}

export const updatePolicyId = (policyList: PolicyTree, nodePath: string, policyId: string): PolicyTree => {
  return policyList.map((node) => {
    return {
      ...node,
      policyId: node.path.startsWith(nodePath) ? policyId : node.policyId,
      children: node.children !== undefined ? updatePolicyId(node.children, nodePath, policyId) : undefined,
    } as PolicyTreeNode
  })
}

/*
  * JSON Lines 用の parser、普通の JSON も parse できる。
  *
  * From:
  * {"path": "/path/to/file1", "size": 123, "type": "directory"}
  * {"path": "/path/to/file2", "size": 234, "type": "file"}
  *
  * To:
  * [
  *   {"path": "/path/to/file1", "size": 123, "type": "directory"},
  *   {"path": "/path/to/file2", "size": 234, "type": "file"}
  * ]
  */
export const parseJsonLines = (rawStr: string): object | object[] => {
  let jsonStr = rawStr
    .replace(/[ \n]/g, "")
    .replace(/},/g, "}")
    .replace(/}/g, "},")
    .trim()
  const isRootArray = jsonStr[0] === "["
  jsonStr = isRootArray ? jsonStr : `[${jsonStr}]`
  jsonStr = jsonStr
    .replace(/,}/g, "}")
    .replace(/,]/g, "]")
  const json = JSON.parse(jsonStr)

  return json.length === 1 && !isRootArray ? json[0] : json
}

export const NONE_POLICY_CONFIG: PolicyConfig = {
  "id": "none",
  "label": "None",
  "generation": 0,
  "interval": 0,
  "diffRatio": 0,
  "costPerMonth": 0,
  "constCost": 0,
  "type": "s3",
}

export const initPolicyTree = (
  existingPolicyTree: PolicyTree = [],
  fileSystemObjs: FileSystemObj[],
  defaultPolicy: string = NONE_POLICY_CONFIG.id,
): PolicyTree => {
  const pathToNodeMap: { [key: string]: PolicyTreeNode } = {}

  // Map existing policy tree nodes
  const mapTreeNodes = (nodes: PolicyTreeNode[]) => {
    nodes.forEach(node => {
      pathToNodeMap[node.path] = node
      if (node.children) mapTreeNodes(node.children)
    })
  }

  // Initialize pathToNodeMap with existing policy tree
  mapTreeNodes(existingPolicyTree)

  const newPolicyTree = [...existingPolicyTree]

  // Add new nodes to pathToNodeMap
  fileSystemObjs.sort((a, b) => a.path.localeCompare(b.path))
  fileSystemObjs.forEach((obj) => {
    const node: PolicyTreeNode = {
      ...obj,
      children: undefined,
      policyId: defaultPolicy,
    }
    const parentPath = obj.path.split("/").slice(0, -1).join("/")
    if (pathToNodeMap[parentPath] === undefined) {
      newPolicyTree.push(node)
    } else {
      if (pathToNodeMap[parentPath].children === undefined) {
        pathToNodeMap[parentPath].children = []
      }
      pathToNodeMap[parentPath].children?.push(node)
    }
    pathToNodeMap[obj.path] = node
  })

  return newPolicyTree
}

/*
  * Backup する際の 1 ヶ月分のコストを計算する。
  *
  * Props:
  *
  * - size: Data size (GB 単位など、constPerMonth と単位が合えばよい)
  * - generation: 保持する世代数
  *   - 1 以上の整数とする
  * - diffRatio: incremental backup の差分データ量の割合 (0.01 なら 1%)
  *   - 1 の場合、Full Backup となる
  * - costPerMonth: GB あたりの 1 ヶ月分のコスト (USD、0.01 USD/GB/month なら 0.01)
  * - constCost: 固定コスト (e.g., AWS EC2 インスタンス, 月額 USD)
  *
  * Comments:
  *
  * - interval はコスト計算に関与しない
  * - 結局、同時に保持されるデータ量を計算し、それにコストをかける
  *   - Full Backup も Incremental Backup も同じように計算できる
  */
export const calcBackupCost = (
  size: number,
  generation: number = 1,
  diffRatio: number = 1,
  costPerMonth: number,
  constCost: number = 0,
): number => {
  if (size <= 0) return 0

  const maxBackupSize = size + (size * diffRatio * (generation - 1))
  return maxBackupSize * costPerMonth + constCost
}

type PolicyToSizeMap = { [key: string]: number }

export const calcSumFileSize = (policyTree: PolicyTree, policyConfigs: PolicyConfig[]): PolicyToSizeMap => {
  const policyToSizeMap = [NONE_POLICY_CONFIG, ...policyConfigs].reduce((acc: PolicyToSizeMap, policy) => {
    acc[policy.id] = 0
    return acc
  }, {})

  const traverse = (node: PolicyTreeNode) => {
    if (node.children && node.children.length > 0) {
      // children が存在する場合 (i.e., 親 directory)、子ノードを走査
      node.children.forEach(child => traverse(child))
    } else {
      // childrenが存在しない場合、このノードのサイズを加算
      policyToSizeMap[node.policyId] += node.size
    }
  }

  policyTree.forEach(node => traverse(node))

  return policyToSizeMap
}

export const calcBackupTotalCost = (policyTree: PolicyTree, policyConfigs: PolicyConfig[], policyToSizeMap: PolicyToSizeMap | null = null): number => {
  policyToSizeMap = policyToSizeMap || calcSumFileSize(policyTree, policyConfigs)

  const totalCost = Object.entries(policyToSizeMap).reduce((acc, [policyId, size]) => {
    if (policyId === NONE_POLICY_CONFIG.id) return acc
    const config = policyConfigs.find(p => p.id === policyId)!
    return acc + calcBackupCost(size / (1024 ** 3), config.generation, config.diffRatio, config.costPerMonth, config.constCost)
  }, 0)

  return totalCost * DOLLAR_YEN_RATE
}

interface EachPathNode {
  policyId: string
  exclude: string[]
}

const leftStrip = (path: string, base: string): string => {
  return path.startsWith(base) ? path.slice(base.length) : path
}

/*
  * policyTree から policy ごとの s3 command 用の設定を生成する
  * 未知の file や dir が来た時、parent の policy を引き継ぐという仕様のため、この生成 logic は少し複雑になる
  * 
  * 1. policyTree を flatten して、path と policyId の map を作成
  * 2. 全 path を sort する (child node が常に parent node より先に来るようにする)
  * 3. 末端 node (sort の最後) から順に、下の処理を行う
  *   3.1. parent node が同じ policy の場合
  *   3.2. 異なる場合
  */
export const mapBackupFiles = (policyTree: PolicyTree, policyConfigs:
  PolicyConfig[]): BackupFiles => {
  // 1. policyTree を flatten して、path と policyId の map を作成
  const pathToPolicyMap: { [key: string]: EachPathNode } = {}
  const traverse = (node: PolicyTreeNode) => {
    pathToPolicyMap[node.path] = { policyId: node.policyId, exclude: [] }
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverse(child))
    }
  }
  policyTree.forEach(node => traverse(node))

  // 2. 全 path を sort する (child node が常に parent node より先に来るようにする)
  const allPaths = Object.keys(pathToPolicyMap).sort((a, b) => b.localeCompare(a))

  // 3. child node から順に、BackupFile を生成
  const policyToFilesMap: BackupFiles = policyConfigs.reduce((acc: BackupFiles, policy) => {
    acc[policy.id] = []
    return acc
  }, {})
  for (const path of allPaths) {
    const node = pathToPolicyMap[path]
    const parentPath = path.split("/").slice(0, -1).join("/")
    if (!(parentPath in pathToPolicyMap)) {
      // root node
      if (node.policyId !== NONE_POLICY_CONFIG.id) {
        policyToFilesMap[node.policyId].push({ path, exclude: node.exclude })
      }
      continue
    }
    console.log(parentPath)

    if (node.policyId === pathToPolicyMap[parentPath].policyId) {
      // 3.1. parent node が同じ policy の場合
      pathToPolicyMap[parentPath].exclude.push(...node.exclude)
    } else {
      // 3.2. parent node が異なる policy の場合
      pathToPolicyMap[parentPath].exclude.push(path)
      if (node.policyId !== NONE_POLICY_CONFIG.id) {
        policyToFilesMap[node.policyId].push({ path, exclude: node.exclude })
      }
    }
  }

  // 4. exclude の中身を相対 path に変換
  for (const policyId in policyToFilesMap) {
    policyToFilesMap[policyId] = policyToFilesMap[policyId].map(file => {
      return {
        path: file.path,
        exclude: file.exclude.map(excPath => `${leftStrip(excPath, `${file.path}/`)}/*`),
      }
    })
  }

  return policyToFilesMap
}
