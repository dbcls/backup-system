import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"

import getFileListScript from "@/assets/get_file_list.sh?raw"
import getFileListUrl from "@/assets/get_file_list.sh?url"
import CodeBlock from "@/components/CodeBlock"
import FileListUploadFrom from "@/components/FileListUploadForm"
import OpenInNewLink from "@/components/OpenInNewLink"
import SecHeader from "@/components/SecHeader"

interface FileListSecProps {
  sx?: SxProps
}

export default function FileListSec(props: FileListSecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="1. File List の読み込み" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1" component="div">
          まず、下の Script (<OpenInNewLink text="get_file_list.sh" href={getFileListUrl} />) を Server 上で実行し、
        </Typography>
        <CodeBlock codeString={getFileListScript} language="bash" sx={{ margin: "1.5rem 0" }} />
        <Typography variant="body1">
          出力された JSON ファイルを下のフォームでアップロードしてください。
        </Typography>
        <FileListUploadFrom sx={{ margin: "1.5rem 0" }} />
      </Box>
    </Box>
  )
}
