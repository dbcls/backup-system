import { Box, Typography } from "@mui/material"
import { SxProps } from "@mui/system"
import { PieChart, PieChartProps, pieArcLabelClasses } from "@mui/x-charts/PieChart"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"

import PolicyTree from "@/components/PolicyTree"
import SecHeader from "@/components/SecHeader"
import { policyConfigsAtom, policyTreeAtom } from "@/store"
import { humanReadableSize, NONE_POLICY_CONFIG, calcSumFileSize, calcBackupTotalCost } from "@/utils"


export const getColor = (i: number, none: boolean = false) => {
  // https://observablehq.com/@d3/color-schemes
  const NONE_COLOR = "#bab0ab"
  const COLORS = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f"]
  if (none) return NONE_COLOR
  return COLORS[i % COLORS.length]
}

interface PolicySecProps {
  sx?: SxProps
}

export default function PolicySec({ sx }: PolicySecProps) {
  const policyTree = useRecoilValue(policyTreeAtom)
  const policyConfigs = useRecoilValue(policyConfigsAtom)
  const [totalCost, setCost] = useState("0")
  const [fileSizeData, setFileSizeData] = useState<PieChartProps["series"][0]["data"]>([])
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    const policyToSizeMap = calcSumFileSize(policyTree, policyConfigs)
    const cost = calcBackupTotalCost(policyTree, policyConfigs, policyToSizeMap)
    setFileSizeData([...policyConfigs, NONE_POLICY_CONFIG].map(config => ({
      id: config.id,
      label: `${config.label} (${humanReadableSize(policyToSizeMap[config.id])})`,
      value: policyToSizeMap[config.id]
    })))
    setColors([...policyConfigs, NONE_POLICY_CONFIG].map((config, i) => getColor(i, config.id === NONE_POLICY_CONFIG.id)))
    setCost(cost.toFixed(2))
  }, [policyTree, policyConfigs])

  return (
    <Box sx={{ ...sx }}>
      <SecHeader title="2. Backup Policy の設定" />
      <Box sx={{ margin: "1.5rem" }}>
        <Typography variant="body1">
          Upload された File List に対する Backup Policy を設定してください。
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", margin: "1.5rem 0" }}>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }} children="1ヶ月あたりのコスト:" />
            <Box sx={{ margin: "0 0.5rem" }}>
              <Typography variant="body1" sx={{ fontSize: "1.5rem", textDecoration: "underline", color: "#3f51b5" }} children={totalCost} />
            </Box>
            <Typography variant="body1" sx={{ fontSize: "1.2rem" }} children="円" />
          </Box>
          <Box>
            {policyTree.length !== 0 &&
              <PieChart
                colors={colors}
                series={[
                  {
                    data: fileSizeData,
                    innerRadius: 30,
                    cornerRadius: 5,
                    arcLabel: (item) => (item.label || "").replace(/\s*\(.*\)/, ""),
                    arcLabelMinAngle: 45,
                    cx: 100,
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontWeight: "bold",
                  },
                }}
                width={400}
                height={200}
              />
            }
          </Box>
        </Box>
        <PolicyTree sx={{ margin: "1.5rem 0" }} />
      </Box>
    </Box>
  )
}
