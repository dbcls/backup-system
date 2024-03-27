import { Box } from "@mui/material"
import { SxProps } from "@mui/system"

import SecHeader from "@/components/SecHeader"

interface FileListSecProps {
  sx?: SxProps
}

export default function FileListSec(props: FileListSecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="1. File List の読み込み" />
    </Box>
  )
}
