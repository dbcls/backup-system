import { Box, Typography, TextField } from "@mui/material"
import { SxProps } from "@mui/system"
import { useRecoilValue } from "recoil"

import CodeBlock from "@/components/CodeBlock"
import SecHeader from "@/components/SecHeader"
import { policyConfigsAtom, policyTreeAtom } from "@/store"
import { generateBackupScript, mapBackupFiles } from "@/utils"

interface ServerSettingSecProps {
  sx?: SxProps
}

export default function ServerSettingSec(props: ServerSettingSecProps) {
  const policyTree = useRecoilValue(policyTreeAtom)
  const policyConfigs = useRecoilValue(policyConfigsAtom)
  const backupFiles = mapBackupFiles(policyTree, policyConfigs)

  const backupScript = generateBackupScript({
    backupFiles,
    policyConfigs,
  })

  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="3. Server での設定" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1">
          下の Script は、Backup Policy を元に生成された Backup Script です。これを Crontab などで定期実行されるように設定してください。(TODO Update)
        </Typography>
        <Box sx={{ margin: "1.5rem 0", display: "flex" }}>
          <TextField label="s3 Bucket Name (e.g.)" color="secondary" size="small" />
          <TextField label="rsync host name (e.g.)" color="secondary" size="small" />
          <TextField label="slack url" color="secondary" size="small" />
        </Box>
        <CodeBlock codeString={backupScript} language="bash" sx={{ margin: "1.5rem 0" }} />
      </Box>
    </Box >
  )
}
