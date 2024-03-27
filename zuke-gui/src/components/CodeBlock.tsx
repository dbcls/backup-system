import CheckIcon from "@mui/icons-material/Check"
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined"
import { Card, Tooltip, IconButton } from "@mui/material"
import { SxProps } from "@mui/system"
import { useState } from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs"

interface CodeBlockProps {
  sx?: SxProps
  codeString: string
  language?: string
}

export default function CodeBlock({ sx, codeString, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    })
  }

  return (
    <Card sx={{ ...sx, position: "relative" }} variant="outlined">
      <Tooltip title="Copied!" arrow placement="left" open={copied} disableFocusListener disableHoverListener disableTouchListener>
        <IconButton onClick={handleCopy} sx={{ position: "absolute", top: 8, right: 8, cursor: "pointer" }} >
          {copied ? <CheckIcon /> : <FileCopyOutlinedIcon />}
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter showLineNumbers language={language} style={github} customStyle={{ margin: 0, padding: "1rem 0.5rem" }}>
        {codeString}
      </SyntaxHighlighter>
    </Card>
  )
}

