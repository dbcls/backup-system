import { FileUploadOutlined } from "@mui/icons-material"
import { Box, Typography, Card } from "@mui/material"
import { SxProps } from "@mui/system"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useRecoilState } from "recoil"

import { policyTreeAtom } from "@/store"
import { FileSystemObjArraySchema } from "@/types"
import { parseJsonLines, initPolicyTree } from "@/utils"

interface FileListUploadFromProps {
  sx?: SxProps
}

export default function FileListUploadFrom(props: FileListUploadFromProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [policyTree, setPolicyTree] = useRecoilState(policyTreeAtom)

  const onDrop = (acceptedFiles: File[]) => {
    setUploadError(null)
    if (acceptedFiles.length === 0) {
      setUploadError("ファイルが選択されていません。")
      return
    } else if (acceptedFiles.length > 1) {
      setUploadError("ファイルは 1 つだけ選択してください。")
      return
    }
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      const parseResult = FileSystemObjArraySchema.safeParse(parseJsonLines(text))
      if (!parseResult.success) {
        setUploadError("ファイルの形式が正しくありません。")
        return
      }
      const newPolicyTree = initPolicyTree(policyTree, parseResult.data)
      setPolicyTree(newPolicyTree)
    }
    reader.onerror = () => {
      setUploadError("ファイルの読み込みに失敗しました。")
    }
    reader.onabort = () => {
      setUploadError("ファイルの読み込みが中断されました。")
    }
    reader.readAsText(file)
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 })

  return (
    <Box sx={{ ...props.sx }}>
      <Card {...getRootProps()} variant="outlined" sx={{ background: "rgb(248, 248, 248)", textAlign: "center", cursor: "pointer", maxWidth: "600px" }}>
        <input {...getInputProps()} />
        <Box sx={{ margin: "1rem" }}>
          <FileUploadOutlined sx={{ fontSize: "2.5rem" }} />
          {uploadError === null ? (isDragActive ?
            <Typography variant="body1">ここにファイルをドロップしてください。</Typography> :
            <Typography variant="body1">ファイルをここにドロップするか、クリックして選んでください。</Typography>) :
            <Typography variant="body1" sx={{ color: "red" }}>{uploadError}</Typography>}
        </Box>
      </Card>
    </Box>
  )
}
