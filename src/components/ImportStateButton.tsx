import { Button } from "@mui/material"
import { SxProps } from "@mui/system"
import { useRef } from "react"
import { useSetRecoilState } from "recoil"
import {
  alertAtom, policyConfigsAtom, policyTreeAtom, endpointUrlAtom, bucketNameAtom, accessKeyIdAtom, secretAccessKeyAtom
} from "@/store"
import { AppStateSchema } from "@/types"

interface ImportStateButtonProps {
  sx?: SxProps
}

export default function ImportStateButton({ sx }: ImportStateButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setPolicyConfigs = useSetRecoilState(policyConfigsAtom)
  const setPolicyTree = useSetRecoilState(policyTreeAtom)
  const setEndpointUrl = useSetRecoilState(endpointUrlAtom)
  const setBucketName = useSetRecoilState(bucketNameAtom)
  const setAccessKeyId = useSetRecoilState(accessKeyIdAtom)
  const setSecretAccessKey = useSetRecoilState(secretAccessKeyAtom)
  const setAlert = useSetRecoilState(alertAtom)

  const openFileLoader = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0)
    if (file) {
      const fileContent = await file.text()
      const parseResult = await AppStateSchema.safeParseAsync(JSON.parse(fileContent))
      if (!parseResult.success) {
        setAlert(`ファイルの形式が正しくありません。 ${parseResult.error.message}`)
      } else {
        const data = parseResult.data
        setPolicyConfigs(data.policyConfigs)
        setPolicyTree(data.policyTree)
        setEndpointUrl(data.s3Config.endpointUrl)
        setBucketName(data.s3Config.bucketName)
        setAccessKeyId(data.s3Config.accessKeyId)
        setSecretAccessKey(data.s3Config.secretAccessKey)
      }
    }
  }

  return (
    <>
      <Button
        variant="contained"
        sx={{ ...sx, border: "1px solid white", color: "white" }}
        onClick={openFileLoader}
      >
        App の状態を読み込む
      </Button>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImport}
      />
    </>
  )
}
