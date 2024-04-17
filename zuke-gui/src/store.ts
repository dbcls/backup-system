import { atom } from "recoil"

import { PolicyTree } from "@/types"

export const uploadedFileListAtom = atom<string | null>({
  key: "uploadedFileList",
  default: null,
})

export const policyTreeAtom = atom<PolicyTree>({
  key: "policyTree",
  default: [],
})
