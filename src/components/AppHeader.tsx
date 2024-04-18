import { Box, AppBar, Typography, Button } from "@mui/material"
import { SxProps } from "@mui/system"

interface AppHeaderProps {
  sx?: SxProps
}

export default function AppHeader(props: AppHeaderProps) {
  return (
    <Box sx={{ ...props.sx, flexGrow: 1 }}>
      <AppBar position="static" sx={{ minHeight: "64px" }}>
        <Box sx={{ flexGrow: 1, lineHeight: "64px", ml: "1.5rem", mr: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography component="h1" sx={{ fontSize: "1.5rem" }}>
            Zuke
          </Typography>
          <Box>
            <Button variant="contained" sx={{ mr: "1.5rem", border: "1px solid white", color: "white" }}>
              App の状態を保存
            </Button>
            <Button variant="contained" sx={{ border: "1px solid white", color: "white" }}>
              App の状態を読み込む
            </Button>
          </Box>
        </Box>
      </AppBar>
    </Box>
  )
}
