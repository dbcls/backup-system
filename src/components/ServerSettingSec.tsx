import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"
import S3ConfigForm from "@/components/S3ConfigForm"
import SecHeader from "@/components/SecHeader"
import OpenInNewLink from "@/components/OpenInNewLink"
import DownloadScriptsButton from "@/components/DownloadScriptsButton"
import CodeBlock from "@/components/CodeBlock"

interface ServerSettingSecProps {
  sx?: SxProps
}

const exampleCode = `\
# After downloading a zip file from the button above.
$ ls
zuke-scripts-240801-000000.zip
$ unzip zuke-scripts-240801-000000.zip
$ cd zuke-scripts-240801-000000
$ ls
backup_files.json  backup.sh  policy_configs.json  s3_config.json

# See help and run the script.
$ bash ./backup.sh --help
Usage: ./backup.sh [--dryrun] [--policy <daily|weekly|monthly>]
$ bash ./backup.sh --policy daily
[2024-08-01 08:00:00] Start daily backup.
...`

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
          その後、Backup 設定と <OpenInNewLink text="backup.sh" href="./backup.sh" /> を含む Zip ファイルをダウンロードして、cron などで定期実行してください。
        </Typography>
        <DownloadScriptsButton sx={{ margin: "1.5rem" }} />
        <CodeBlock sx={{ margin: "0 0 1.5rem" }} codeString={exampleCode} language="bash" />
      </Box>
    </Box >
  )
}
