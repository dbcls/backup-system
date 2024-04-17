import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

interface AppFooterProps {
  sx?: SxProps
}

// TODO: version should be dynamic
export default function AppFooter(props: AppFooterProps) {
  return (
    <Box sx={{ ...props.sx, margin: "0 0 1.5rem" }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright ©"} DBCLS {new Date().getFullYear()}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        Zuke-GUI {"Version 1.0.0"}
      </Typography>
    </Box >
  )
}
