import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

interface AppFooterProps {
  sx?: SxProps
}

export default function AppFooter({ sx }: AppFooterProps) {
  return (
    <Box sx={{ ...sx, margin: "0 0 1.5rem" }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright"} {new Date().getFullYear()} DBCLS (Database Center for Life Science), Japan
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Zuke {__APP_VERSION__}
      </Typography>
    </Box >
  )
}
