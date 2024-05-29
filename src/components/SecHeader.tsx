import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

interface SecHeaderProps {
  title: string
  description?: string
  sx?: SxProps
}

export default function SecHeader({ title, description, sx }: SecHeaderProps) {
  return (
    <Box sx={sx}>
      <Typography variant="h2" sx={{ fontSize: "2rem" }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" sx={{ marginTop: "0.5rem", whiteSpace: "pre-line" }}>
          {description}
        </Typography>
      )}
    </Box>
  )
}

