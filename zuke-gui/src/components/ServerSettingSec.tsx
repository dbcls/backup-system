import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

import egBackupScript from "@/assets/eg_backup_script.sh?raw"
import CodeBlock from "@/components/CodeBlock"
import SecHeader from "@/components/SecHeader"

interface ServerSettingSecProps {
  sx?: SxProps
}

export default function ServerSettingSec(props: ServerSettingSecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="3. Server での設定" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1">
          下の Script は、Backup Policy を元に生成された Backup Script です。これを Crontab などで定期実行されるように設定してください。
        </Typography>
        <CodeBlock codeString={egBackupScript} language="bash" sx={{ margin: "1.5rem 0" }} />
      </Box>
    </Box>
  )
}
