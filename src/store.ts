import { atom } from "recoil"

import policyConfig from "@/policyConfig.json"
import { PolicyTree, PolicyConfig } from "@/types"

export const uploadedFileListAtom = atom<string | null>({
  key: "uploadedFileList",
  default: null,
})

export const policyConfigAtom = atom<PolicyConfig[]>({
  key: "policyConfig",
  default: policyConfig,
})

export const policyTreeAtom = atom<PolicyTree>({
  key: "policyTree",
  default: [],
})
