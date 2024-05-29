import { Box } from "@mui/material"
import { SxProps } from "@mui/system"

import OurMarkdown from "@/components/OurMarkdown"
import SecHeader from "@/components/SecHeader"

interface IntroSecProps {
  sx?: SxProps
}

const descContent = `
このアプリは、以下の手順でサーバ上のデータのバックアップ設定を行います。

- **1.File List の読み込み**
  - サーバ上でスクリプト (\`get_file_list.sh\`) を実行し、生成されたファイルリストをこのアプリに読み込みます
- **2. Backup Policy の設定**
  - 各ファイルごとに Backup Policy (頻度やバックアップ先など) を設定します
- **3. Server での設定**
  - Policy に基づいて生成されたバックアップスクリプトをサーバ上で設定します

補足:

- このアプリは、どこかのサーバに情報を送信することはなく、全てのデータ処理をブラウザ内で行います
- ブラウザ内のクッキーやローカルストレージも使用しません。アプリの現在の状態を一次保存する場合は、ヘッダーバーにある「アプリの状態を保存」ボタンを使用してください
`

export default function IntroSec(props: IntroSecProps) {
  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="この App は何？🤔" />
      <OurMarkdown markdown={descContent} sx={{ margin: "1.5rem" }} />
    </Box>
  )
}
