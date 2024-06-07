import { Button } from "@mui/material"
import { SxProps } from "@mui/system"
import { useRef } from "react"
import { useSetRecoilState } from "recoil"

import { alertAtom, policyConfigAtom, policyTreeAtom } from "@/store"
import { AppStateSchema } from "@/types"

interface ImportStateButtonProps {
  sx?: SxProps
}

export default function ImportStateButton({ sx }: ImportStateButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setPolicyConfig = useSetRecoilState(policyConfigAtom)
  const setPolicyTree = useSetRecoilState(policyTreeAtom)
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
        setPolicyConfig(data.policyConfig)
        setPolicyTree(data.policyTree)
      }
    }
  }

  return (
    <>
      <Button
        variant="contained"
        sx={{ mr: "1.5rem", border: "1px solid white", color: "white", ...sx }}
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
