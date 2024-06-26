import policyConfigFile from "@/policyConfig.json"
import { PolicyTree, PolicyTreeNode, FileSystemObj, PolicyConfig, BackupFiles, ScriptParams } from "@/types"

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

export const mapBackupFiles = (policyTree: PolicyTree, policyConfigs: PolicyConfig[]): BackupFiles => {
  const policyToFilesMap: BackupFiles = policyConfigs.reduce((acc: BackupFiles, policy) => {
    acc[policy.id] = []
    return acc
  }, {})

  const traverse = (node: PolicyTreeNode) => {
    if (node.children && node.children.length > 0) {
      // children が存在する場合 (i.e., 親 directory)、子ノードを走査
      node.children.forEach(child => traverse(child))
    } else {
      if (node.policyId === NONE_POLICY_CONFIG.id) return
      // childrenが存在しない場合、このノードの path を加算
      policyToFilesMap[node.policyId].push(node.path)
    }
  }

  policyTree.forEach(node => traverse(node))

  return policyToFilesMap
}

export const generateBackupScript = (scriptParams: ScriptParams): string => {
  return `#!/bin/bash

# Usage: .backup.sh

set -u

# === Backup Params ===

BACKUP_FILES='${JSON.stringify(scriptParams.backupFiles)}'
POLICY_CONFIGS='${JSON.stringify(scriptParams.policyConfigs)}'

# === Backup Script ===

function full_backup() {
  local paths=$1
  local policy=$2
  aws s3 sync $paths s3://my-backup-bucket/$policy
}

function inc_backup() {
  local paths=$1
  local policy=$2
  rsync -a $paths s3://my-backup-bucket/$policy
}

function do_backup() {
  local policies=$(echo $POLICY_CONFIGS | jq -r '.[]')
  for policy in $policies; do
    local policy_id=$(echo $policy | jq -r '.id')
    local diff_ratio=$(echo $policy | jq -r '.diffRatio')
    local paths=$(echo $BACKUP_FILES | jq -r --arg policy_id "$policy_id" '.[$policy_id][]')
    if [[ diff_ratio -eq 1 ]]; then
      full_backup $paths $policy
    else
      inc_backup $paths $policy
    fi
  done
}

function main() {
  echo "Start backup"
  do_backup
  echo "Finish backup"
}

main
`
}
