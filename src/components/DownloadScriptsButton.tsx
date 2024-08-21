import { SxProps } from "@mui/system"
import { Button } from "@mui/material"
import { useRecoilValue } from "recoil"
import { policyConfigsAtom, policyTreeAtom, s3ConfigAtom, formInputtedSelector, appStateSelector } from "@/store"
import { mapBackupFiles } from "@/utils"
import backupScript from "@/backup.sh?raw"  // Cannot import as text file from public directory
import JSZip from "jszip"

interface DownloadScriptsButtonProps {
  sx?: SxProps
}

export default function DownloadScriptsButton({ sx }: DownloadScriptsButtonProps) {
  const formInputted = useRecoilValue(formInputtedSelector)

  const policyTree = useRecoilValue(policyTreeAtom)
  const policyConfigs = useRecoilValue(policyConfigsAtom)
  const backupFiles = mapBackupFiles(policyTree, policyConfigs)
  const s3Config = useRecoilValue(s3ConfigAtom)
  const appState = useRecoilValue(appStateSelector)

  const handleDownload = () => {
    const formattedDate = new Date().toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/[/:]/g, "").replace(/ /g, "-").slice(2)
    const zip = new JSZip()
    zip.file(`zuke-scripts-${formattedDate}/backup.sh`, backupScript)
    zip.file(`zuke-scripts-${formattedDate}/backup_files.json`, JSON.stringify(backupFiles, null, 2))
    zip.file(`zuke-scripts-${formattedDate}/policy_configs.json`, JSON.stringify(policyConfigs, null, 2))
    zip.file(`zuke-scripts-${formattedDate}/s3_config.json`, JSON.stringify(s3Config, null, 2))
    zip.file(`zuke-scripts-${formattedDate}/app_state.json`, JSON.stringify(appState, null, 2))
    zip.generateAsync({ type: "blob" }).then((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `zuke-scripts-${formattedDate}.zip`
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      sx={{
        ...sx,
        textTransform: "none",
      }}
      onClick={handleDownload}
      disabled={!formInputted}
      children={`Zip ファイルをダウンロード${!formInputted ? " (フォームを入力してください)" : ""}`}
    />
  )
}
