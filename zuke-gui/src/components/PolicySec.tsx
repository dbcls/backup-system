import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

import PolicyTree from "@/components/PolicyTree"
import SecHeader from "@/components/SecHeader"

interface PolicySecProps {
  sx?: SxProps
}

export default function PolicySec(props: PolicySecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="2. Backup Policy の設定" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1">
          Upload された File List に対する Backup Policy を設定してください。
        </Typography>
        <Typography variant="body1">
          TODO: Policy のやつを集計して、かかるコストを計算し、ここにいい感じに表示する
        </Typography>
        <PolicyTree sx={{ margin: "1.5rem 0" }} />
        <Typography variant="body1">
          TODO: Policy の説明をここに書く
        </Typography>
      </Box>
    </Box>
  )
}
