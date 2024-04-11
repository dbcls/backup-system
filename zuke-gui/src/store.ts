import { atom } from "recoil"

import treeDataExample from "@/treeDataExample.json"
import { FileSystemObject } from "@/types"

export const uploadedFileListAtom = atom<string | null>({
  key: "uploadedFileList",
  default: null,
})

export const backupPolicyAtom = atom<object>({
  key: "backupPolicy",
  default: {},
})

const initPolicy = (policyList: FileSystemObject[], root: boolean): FileSystemObject[] => {
  return policyList.map((policy) => {
    return {
      ...policy,
      root: root,
      children: policy.children ? initPolicy(policy.children, false) : undefined,
      policy: "PolicyA",
    }
  })
}

export const backupPolicyListAtom = atom<FileSystemObject[]>({
  key: "backupPolicyList",
  default: initPolicy(treeDataExample as unknown as FileSystemObject[], true),
})
