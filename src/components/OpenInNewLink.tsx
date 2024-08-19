import { OpenInNew } from "@mui/icons-material"
import { Box, Link, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

interface OpenInNewLinkProps {
  sx?: SxProps
  text: string
  href: string
}

export default function OpenInNewLink({ sx, ...props }: OpenInNewLinkProps) {
  return (
    <Link href={props.href} target="_blank" rel="noopener noreferrer" sx={{ ...sx, display: "inline-block", margin: "0 0.2rem" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body1" component="span" sx={{ marginRight: "0.3rem" }}>
          {props.text}
        </Typography>
        <OpenInNew fontSize="small" />
      </Box>
    </Link >
  )
}
