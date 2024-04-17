import { FolderOpenOutlined } from "@mui/icons-material"
import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useRecoilState } from "recoil"

import { policyTreeAtom } from "@/store"
import { PolicyTree } from "@/types"
import { humanReadableSize, pathBasename, updatePolicyId } from "@/utils"
import { defaultPolicyList } from "@/utils"

interface PolicyTreeItemProps {
  nodes: PolicyTree
  isRoot: boolean
}

export default function PolicyTreeItems({ nodes, isRoot }: PolicyTreeItemProps) {
  const [policyTree, setPolicyTree] = useRecoilState(policyTreeAtom)

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
                {defaultPolicyList.map((policy) => (
                  <ToggleButton
                    key={policy.id}
                    value={policy.id}
                    sx={{
                      fontSize: "0.8rem",
                      borderRadius: "12px",
                      padding: "0.1rem 0.4rem",
                      textTransform: "none",
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
