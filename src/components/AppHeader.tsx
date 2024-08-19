import { Box, AppBar, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

import ExportStateButton from "@/components/ExportStateButton"
import ImportStateButton from "@/components/ImportStateButton"

interface AppHeaderProps {
  sx?: SxProps
}

export default function AppHeader({ sx }: AppHeaderProps) {
  return (
    <Box sx={{ ...sx, flexGrow: 1 }}>
      <AppBar position="static" sx={{ minHeight: "64px" }}>
        <Box sx={{ flexGrow: 1, lineHeight: "64px", margin: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography component="h1" sx={{ fontSize: "1.5rem" }}>
            Zuke
          </Typography>
          <Box>
            <ExportStateButton sx={{ mr: "1.5rem" }} />
            <ImportStateButton />
          </Box>
        </Box>
      </AppBar>
    </Box>
  )
}
