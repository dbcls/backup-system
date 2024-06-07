import { atom } from "recoil"

import policyConfigFile from "@/policyConfig.json"
import { PolicyTree, PolicyConfig } from "@/types"

export const policyConfigAtom = atom<PolicyConfig[]>({
  key: "policyConfig",
  default: policyConfigFile.policyConfig,
})

export const policyTreeAtom = atom<PolicyTree>({
  key: "policyTree",
  default: [],
})

export const alertAtom = atom<string | null>({
  key: "alert",
  default: null,
})
