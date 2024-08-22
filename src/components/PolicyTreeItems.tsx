import { FolderOpenOutlined } from "@mui/icons-material"
import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useRecoilState, useRecoilValue } from "recoil"

import { policyConfigsAtom, policyTreeAtom } from "@/store"
import { PolicyTree, PolicyConfig } from "@/types"
import { humanReadableSize, pathBasename, updatePolicyId, NONE_POLICY_CONFIG } from "@/utils"
import { getColor } from "@/components/PolicySec"

interface PolicyTreeItemProps {
  nodes: PolicyTree
  isRoot: boolean
}

interface ButtonColor {
  fontColor: string
  backgroundColor: string
  hoverBackgroundColor: string
}

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const getButtonColors = (policyConfigs: PolicyConfig[]): ButtonColor[] => {
  const hexColors = policyConfigs.map((config, i) => getColor(i, config.id === NONE_POLICY_CONFIG.id))
  return hexColors.map(hexColor => ({
    fontColor: hexColor,
    backgroundColor: hexToRgba(hexColor, 0.08),
    hoverBackgroundColor: hexToRgba(hexColor, 0.12),
  }))
}

export default function PolicyTreeItems({ nodes, isRoot }: PolicyTreeItemProps) {
  const [policyTree, setPolicyTree] = useRecoilState(policyTreeAtom)
  const policyConfigs = useRecoilValue(policyConfigsAtom)
  const buttonColors = getButtonColors([...policyConfigs, NONE_POLICY_CONFIG])

  const handleChangePolicy = (nodePath: string, policyId: string) => {
    const newPolicyTree = updatePolicyId(policyTree, nodePath, policyId)
    setPolicyTree(newPolicyTree)
  }

  return (
    <>
      {nodes.map((node) => (
        <TreeItem
          itemId={node.path}
          key={node.path}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {node.type === "directory" && <FolderOpenOutlined sx={{ mr: "0.5rem" }} />}
              <Typography
                children={isRoot === true ? node.path : pathBasename(node.path)}
                sx={{ fontWeight: node.type === "directory" ? "bold" : "normal" }}
              />
              <Typography
                children={`(${humanReadableSize(node.size)})`}
                sx={{ ml: "0.5rem", fontSize: "0.8rem", fontWeight: "light" }}
              />
              <ToggleButtonGroup
                color="secondary"
                size="small"
                value={node.policyId}
                sx={{
                  ml: "auto",
                  mr: "1.5rem",
                }}
              >
                {[...policyConfigs, NONE_POLICY_CONFIG].map((policy, i) => (
                  <ToggleButton
                    key={policy.id}
                    value={policy.id}
                    sx={{
                      fontSize: "0.8rem",
                      borderRadius: "12px",
                      padding: "0.1rem 0.4rem",
                      textTransform: "none",
                      "&.Mui-selected": {
                        color: buttonColors[i].fontColor,
                        backgroundColor: buttonColors[i].backgroundColor,
                      },
                      "&.Mui-selected:hover": {
                        color: buttonColors[i].fontColor,
                        backgroundColor: buttonColors[i].hoverBackgroundColor,
                      },
                    }}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleChangePolicy(node.path, policy.id)
                    }}
                    children={policy.label}
                  />
                ))}
              </ToggleButtonGroup>
            </Box>
          }
          children={
            node.children ? <PolicyTreeItems nodes={node.children} isRoot={false} /> : null
          }
        />
      ))}
    </>
  )
}
