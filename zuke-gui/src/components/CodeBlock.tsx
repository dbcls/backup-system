import { Check, FileCopyOutlined, UnfoldLessOutlined, UnfoldMoreOutlined } from "@mui/icons-material"
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
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigator.clipboard.writeText(codeString).then(() => {
      setCopied(true)
      setTimeout(() => { setCopied(false) }, 2000)
    })
  }

  const headCodeString = `${codeString.split("\n").slice(0, 10).join("\n")}\n... 省略 (右上の icon で展開) ...\n`

  return (
    <Card sx={{ ...sx, position: "relative" }} variant="outlined">
      <IconButton onClick={() => setIsExpanded(!isExpanded)} sx={{ position: "absolute", top: 8, right: 8, cursor: "pointer" }}>
        {isExpanded ? <UnfoldLessOutlined /> : <UnfoldMoreOutlined />}
      </IconButton>
      <Tooltip title="Copied!" arrow placement="left" open={copied} disableFocusListener disableHoverListener disableTouchListener>
        <IconButton onClick={handleCopy} sx={{ position: "absolute", top: 8, right: 48, cursor: "pointer" }} >
          {copied ? <Check /> : <FileCopyOutlined />}
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter showLineNumbers language={language} style={github} customStyle={{ margin: 0, padding: "1rem 0.5rem", fontSize: "0.8rem" }}>
        {isExpanded ? codeString : headCodeString}
      </SyntaxHighlighter>
    </Card >
  )
}

