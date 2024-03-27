import { FileUploadOutlined } from "@mui/icons-material"
import { Box, Typography, Card } from "@mui/material"
import { SxProps } from "@mui/system"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useSetRecoilState } from "recoil"

import { uploadedFileListAtom } from "@/store"

interface FileListUploadFromProps {
  sx?: SxProps
}

export default function FileListUploadFrom(props: FileListUploadFromProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)
  const setUploadedFileList = useSetRecoilState(uploadedFileListAtom)

  const onDrop = useCallback((acceptedFiles: File[]) => {
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
      const text = reader.result
      // TODO: 型で validation する
      setUploadedFileList(text as string)
    }
    reader.onerror = () => {
      setUploadError("ファイルの読み込みに失敗しました。")
    }
    reader.onabort = () => {
      setUploadError("ファイルの読み込みが中断されました。")
    }
    reader.readAsText(file)
  }, [setUploadedFileList])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

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
