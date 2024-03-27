import { Box } from "@mui/material"
import { SxProps } from "@mui/system"

import SecHeader from "@/components/SecHeader"

interface ServerSettingSecProps {
  sx?: SxProps
}

export default function ServerSettingSec(props: ServerSettingSecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="3. Server での設定" />
    </Box>
  )
}
