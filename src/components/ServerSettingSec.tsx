import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"
import S3ConfigForm from "@/components/S3ConfigForm"
import backupScriptUrl from "@/assets/backup.sh?url"
import SecHeader from "@/components/SecHeader"
import OpenInNewLink from "@/components/OpenInNewLink"
import DownloadScriptsButton from "@/components/DownloadScriptsButton"

interface ServerSettingSecProps {
  sx?: SxProps
}

export default function ServerSettingSec({ sx }: ServerSettingSecProps) {
  return (
    <Box sx={{ ...sx }}>
      <SecHeader title="3. Server での設定" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1">
          下のフォームで S3 Bucket の設定を入力してください。
        </Typography>
        <S3ConfigForm sx={{ margin: "1.5rem" }} />
        <Typography variant="body1" component="div">
          その後、Backup 設定と <OpenInNewLink text="backup.sh" href={backupScriptUrl} /> を含む Zip ファイルをダウンロードして、cron などで定期実行してください。
        </Typography>
        <DownloadScriptsButton sx={{ margin: "1.5rem" }} />
      </Box>
    </Box >
  )
}
