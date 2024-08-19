import { Button } from "@mui/material"
import { SxProps } from "@mui/system"
import { useRecoilValue } from "recoil"

import { policyConfigsAtom, policyTreeAtom } from "@/store"
import { AppState } from "@/types"
import { INTERFACE_VERSION } from "@/types"

interface ExportStateButtonProps {
  sx?: SxProps
}

export default function ExportStateButton({ sx }: ExportStateButtonProps) {
  const policyConfigs = useRecoilValue(policyConfigsAtom)
  const policyTree = useRecoilValue(policyTreeAtom)

  const handleExport = () => {
    const data: AppState = {
      general: {
        appVersion: __APP_VERSION__,
        interfaceVersion: INTERFACE_VERSION,
      },
      policyConfigs,
      policyTree,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    const formattedDate = new Date().toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/[/:]/g, "").replace(/ /g, "-").slice(2)
    link.download = `zuke-state-${formattedDate}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="contained"
      sx={{ ...sx, border: "1px solid white", color: "white" }}
      onClick={handleExport}
    >
      App の状態を保存
    </Button>
  )
}
