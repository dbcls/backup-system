import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

import OurMarkdown from "@/components/OurMarkdown"
import PolicyTree from "@/components/PolicyTree"
import SecHeader from "@/components/SecHeader"
import policyDocsContent from "@/policyDocs.md?raw"
import { policyConfigAtom, policyTreeAtom } from "@/store"
import { calcBackupTotalCost } from "@/utils"

interface PolicySecProps {
  sx?: SxProps
}

export default function PolicySec(props: PolicySecProps) {
  const policyTree = useRecoilValue(policyTreeAtom)
  const policyConfig = useRecoilValue(policyConfigAtom)
  const [totalCost, setCost] = useState("0")

  useEffect(() => {
    const cost = calcBackupTotalCost(policyTree, policyConfig)
    setCost(cost.toFixed(2))
  }, [policyTree, policyConfig])

  return (
    <Box sx={{ ...props.sx }}>
      <SecHeader title="2. Backup Policy の設定" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1">
          Upload された File List に対する Backup Policy を設定してください。
        </Typography>
        <Box sx={{ margin: "1.5rem 0", display: "flex", alignItems: "flex-end" }}>
          <Typography variant="body1" sx={{ fontSize: "1.2rem" }} children="1ヶ月あたりのコスト:" />
          <Box sx={{ margin: "0 0.5rem" }}>
            <Typography variant="body1" sx={{ fontSize: "1.5rem", textDecoration: "underline", color: "#3f51b5" }} children={totalCost} />
          </Box>
          <Typography variant="body1" sx={{ fontSize: "1.2rem" }} children="円" />
        </Box>
        <PolicyTree sx={{ margin: "1.5rem 0" }} />
        <OurMarkdown markdown={policyDocsContent} sx={{ margin: "1.5rem" }} />
      </Box>
    </Box>
  )
}
