import { atom } from "recoil"

export const uploadedFileListAtom = atom<string | null>({
  key: "uploadedFileList",
  default: null,
})

export const backupPolicyAtom = atom<object>({
  key: "backupPolicy",
  default: {},
})
