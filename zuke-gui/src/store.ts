import { atom } from "recoil"

export const uploadedFileListAtom = atom<string | null>({
  key: "uploadedFileList",
  default: null,
})
