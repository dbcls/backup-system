import { atom } from "recoil"

import { PolicyObj } from "@/types"

export const uploadedFileListAtom = atom<string | null>({
  key: "uploadedFileList",
  default: null,
})

export const backupPolicyAtom = atom<PolicyObj[]>({
  key: "backupPolicy",
  default: [],
})
