import { Box } from "@mui/material"
import { SxProps } from "@mui/system"
import Markdown, { Components } from "react-markdown"

const components: Components = {
  ul: ({ children }) => <Box component="ul" children={children} sx={{ "padding": "0 0 0 1.5rem" }} />,
  li: ({ children }) => <Box component="li" children={children} sx={{ "margin": "0.5rem 0" }} />,
}

interface OurMarkdownProps {
  sx?: SxProps
  markdown: string
}

export default function OurMarkdown({ sx, markdown }: OurMarkdownProps) {
  return (
    <Box sx={{ ...sx }}>
      <Markdown components={components}>{markdown}</Markdown>
    </Box>
  )
}
