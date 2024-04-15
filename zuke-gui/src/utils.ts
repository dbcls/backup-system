import { BackupPolicy, PolicyObj, FileSystemObj } from "@/types"

export const humanReadableSize = (size: number) => {
  if (size === 0) return "0.00 B"
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB", "TB", "PB"][i]}`
}

export const pathBasename = (path: string) => {
  return path.split("/").pop()
}

export const updatePolicy = (policyList: BackupPolicy, itemPath: string, policyVal: string): BackupPolicy => {
  return policyList.map((item) => {
    return {
      ...item,
      policy: item.path.startsWith(itemPath) ? policyVal : item.policy,
      children: item.children !== undefined ? updatePolicy(item.children, itemPath, policyVal) : undefined,
    }
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

// TODO: update
export const defaultPolicyList = [
  "PolicyA",
  "PolicyB",
  "PolicyC",
]

export const initPolicyTree = (fileSystemObjs: FileSystemObj[], defaultPolicy: string = defaultPolicyList[0]): BackupPolicy => {
  fileSystemObjs.sort((a, b) => a.path.localeCompare(b.path))
  const pathToNodeMap: { [key: string]: PolicyObj } = {}
  const roots: PolicyObj[] = []

  fileSystemObjs.forEach((obj) => {
    const node: PolicyObj = {
      ...obj,
      children: obj.type === "directory" ? [] : undefined,
      policy: defaultPolicy,
    }
    const parentPath = obj.path.split("/").slice(0, -1).join("/")
    if (pathToNodeMap[parentPath] === undefined) {
      roots.push(node)
    } else {
      if (pathToNodeMap[parentPath].children !== undefined) {
        pathToNodeMap[parentPath].children?.push(node)
      }
    }
    pathToNodeMap[obj.path] = node
  })

  return roots
}
