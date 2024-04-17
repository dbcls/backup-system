import { Box } from "@mui/material"
import { SxProps } from "@mui/system"

import OurMarkdown from "@/components/OurMarkdown"
import SecHeader from "@/components/SecHeader"

interface IntroSecProps {
  sx?: SxProps
}

const descContent = `
- Server 上の Data の Backup 設定を生成するための GUI App です。下の項目を順に行ってください
  - \`"1. File List の読み込み"\`: Server 上で、script  (\`du\` や \`find\`) を実行し、この App に読み込ませる
  - \`"2. Backup Policy の設定"\`: file ごとなどに、Policy (頻度や Backup 先) を設定する
  - \`"3. Server での設定"\`: 生成された Backup script を Server 上に設定する
- この App は、SPA (Single Page Application) で、全ての処理は Browser 上で行います
  - どこかの Server に情報を送信することはありません
  - この App の状態を一時保存する場合は、HeaderBar の "APP の状態を保存" ボタンを押してください
`

export default function IntroSec(props: IntroSecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="この App は何？🤔" />
      <OurMarkdown markdown={descContent} sx={{ margin: "1.5rem" }} />
    </Box>
  )
}
