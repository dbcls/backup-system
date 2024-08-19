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

export const endpointUrlAtom = atom<string>({
  key: "endpointUrl",
  default: "https://s3.ap-northeast-1.amazonaws.com",
})

export const bucketNameAtom = atom<string>({
  key: "bucketName",
  default: "",
})

export const accessKeyIdAtom = atom<string>({
  key: "accessKeyId",
  default: "",
})

export const secretAccessKeyAtom = atom<string>({
  key: "secretAccessKey",
  default: "",
})

export const formInputtedSelector = selector<boolean>({
  key: "formInputted",
  get: ({ get }) => {
    const endpointUrl = get(endpointUrlAtom)
    const bucketName = get(bucketNameAtom)
    const accessKeyId = get(accessKeyIdAtom)
    const secretAccessKey = get(secretAccessKeyAtom)
    return endpointUrl !== "" && bucketName !== "" && accessKeyId !== "" && secretAccessKey !== ""
  },
})

export const s3ConfigSelector = selector<S3Config>({
  key: "s3Config",
  get: ({ get }) => {
    const endpointUrl = get(endpointUrlAtom)
    const bucketName = get(bucketNameAtom)
    const accessKeyId = get(accessKeyIdAtom)
    const secretAccessKey = get(secretAccessKeyAtom)
    return { endpointUrl, bucketName, accessKeyId, secretAccessKey }
  }
})

export const appStateSelector = selector<AppState>({
  key: "appState",
  get: ({ get }) => {
    const policyConfigs = get(policyConfigsAtom)
    const policyTree = get(policyTreeAtom)
    const s3Config = get(s3ConfigSelector)
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
