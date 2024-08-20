import { atom, selector } from "recoil"

import policyConfigFile from "@/policyConfig.json"
import { PolicyTree, PolicyConfig, PolicyConfigsSchema, S3Config, AppState, INTERFACE_VERSION } from "@/types"

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

export const s3ConfigAtom = atom<S3Config>({
  key: "s3Config",
  default: {
    endpointUrl: "https://s3.ap-northeast-1.amazonaws.com",
    bucketName: "",
    accessKeyId: "",
    secretAccessKey: "",
    httpProxy: "",
  },
})

export const formInputtedSelector = selector<boolean>({
  key: "formInputted",
  get: ({ get }) => {
    const s3Config = get(s3ConfigAtom)
    return Object.entries(s3Config).every(([key, value]) => {
      if (key === "httpProxy") {
        return true
      }
      return value !== ""
    })
  },
})

export const appStateSelector = selector<AppState>({
  key: "appState",
  get: ({ get }) => {
    const policyConfigs = get(policyConfigsAtom)
    const policyTree = get(policyTreeAtom)
    const s3Config = get(s3ConfigAtom)
    return {
      general: {
        appVersion: __APP_VERSION__,
        interfaceVersion: INTERFACE_VERSION,
      },
      policyConfigs,
      policyTree,
      s3Config,
    }
  }
})
