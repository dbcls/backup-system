import { Box, Typography, Button } from "@mui/material"
import { SxProps } from "@mui/system"
import { useSetRecoilState } from "recoil"

import getFileListScript from "@/get_file_list.sh?raw" // Cannot import as text file from public directory
import CodeBlock from "@/components/CodeBlock"
import FileListUploadFrom from "@/components/FileListUploadForm"
import OpenInNewLink from "@/components/OpenInNewLink"
import SecHeader from "@/components/SecHeader"
import { policyTreeAtom } from "@/store"

interface FileListSecProps {
  sx?: SxProps
}

export default function FileListSec({ sx }: FileListSecProps) {
  const setPolicyTree = useSetRecoilState(policyTreeAtom)

  return (
    <Box sx={{ ...sx }}>
      <SecHeader title="1. File List の読み込み" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1" component="div">
          まず、下の Script (<OpenInNewLink text="get_file_list.sh" href="./get_file_list.sh" />) を Server 上で実行し、
        </Typography>
        <CodeBlock codeString={getFileListScript} language="bash" sx={{ margin: "1.5rem 0" }} />
        <Typography variant="body1">
          出力された JSON ファイルを下のフォームでアップロードしてください。
          <br />
          続けて、別のファイルをアップロードすると、追加されます。
        </Typography>
        <Box sx={{ display: "flex", gap: "3rem", alignItems: "center", margin: "1.5rem 0" }}>
          <FileListUploadFrom />
          <Button
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none" }}
            onClick={() => setPolicyTree([])}
            children="読み込んだファイルをクリアする"
          />
        </Box>
      </Box>
    </Box>
  )
}
