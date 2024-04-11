import { FileSystemObject } from "@/types"

export const humanReadableSize = (size: number) => {
  if (size === 0) return "0.00 B"
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB", "TB", "PB"][i]}`
}

export const pathBasename = (path: string) => {
  return path.split("/").pop()
}

export const updatePolicyList = (policyList: FileSystemObject[], itemPath: string, policy: string): FileSystemObject[] => {
  return policyList.map((item) => {
    return {
      ...item,
      policy: item.path.startsWith(itemPath) ? policy : item.policy,
      children: item.children ? updatePolicyList(item.children, itemPath, policy) : undefined,
    }
  })
}
