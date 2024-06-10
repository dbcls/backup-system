import { atom } from "recoil"

import policyConfigFile from "@/policyConfig.json"
import { PolicyTree, PolicyConfig, PolicyConfigsSchema } from "@/types"

export const policyConfigsAtom = atom<PolicyConfig[]>({
  key: "policyConfigs",
  default: PolicyConfigsSchema.parse(policyConfigFile.policyConfigs),
})

export const policyTreeAtom = atom<PolicyTree>({
  key: "policyTree",
  default: [],
})

export const alertAtom = atom<string | null>({
  key: "alert",
  default: null,
})
