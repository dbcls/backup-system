import { SxProps } from "@mui/system"
import { Button } from "@mui/material"
import { useRecoilValue } from "recoil"
import { policyConfigsAtom, policyTreeAtom, s3ConfigSelector, formInputtedSelector } from "@/store"
import { mapBackupFiles } from "@/utils"
import backupScript from "@/assets/backup.sh?raw"
import JSZip from "jszip"

interface DownloadScriptsButtonProps {
  sx?: SxProps
}

export default function DownloadScriptsButton({ sx }: DownloadScriptsButtonProps) {
  const formInputted = useRecoilValue(formInputtedSelector)

  const policyTree = useRecoilValue(policyTreeAtom)
  const policyConfigs = useRecoilValue(policyConfigsAtom)
  const backupFiles = mapBackupFiles(policyTree, policyConfigs)
  const s3Config = useRecoilValue(s3ConfigSelector)

  const handleDownload = () => {
    const zip = new JSZip()
    zip.file("backup.sh", backupScript)
    zip.file("backup_files.json", JSON.stringify(backupFiles, null, 2))
    zip.file("policy_configs.json", JSON.stringify(policyConfigs, null, 2))
    zip.file("s3_config.json", JSON.stringify(s3Config, null, 2))
    zip.generateAsync({ type: "blob" }).then((blob) => {
      console.log("HERE")
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const formattedDate = new Date().toLocaleDateString(navigator.language, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/[/:]/g, "").replace(/ /g, "-").slice(2)
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
    >
    </Button>
  )
}
