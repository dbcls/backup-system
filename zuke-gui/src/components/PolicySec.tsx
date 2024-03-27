import { Box } from "@mui/material"
import { SxProps } from "@mui/system"

import SecHeader from "@/components/SecHeader"

interface PolicySecProps {
  sx?: SxProps
}

export default function PolicySec(props: PolicySecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="2. Backup Policy の設定" />
    </Box>
  )
}
