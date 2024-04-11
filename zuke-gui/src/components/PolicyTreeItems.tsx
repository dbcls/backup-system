import { FolderOpenOutlined } from "@mui/icons-material"
import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { alpha } from "@mui/system"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useRecoilState } from "recoil"

import { backupPolicyListAtom } from "@/store"
import { FileSystemObject } from "@/types"
import { humanReadableSize, pathBasename, updatePolicyList } from "@/utils"

interface PolicyTreeItemProps {
  items: FileSystemObject[]
}

const policyList = [
  "PolicyA",
  "PolicyB",
  "PolicyC",
]

export default function PolicyTreeItems({ items }: PolicyTreeItemProps) {
  const [backupPolicyList, setBackupPolicyList] = useRecoilState(backupPolicyListAtom)

  const handleChangePolicy = (itemPath: string, policy: string) => {
    const newBackupPolicyList = updatePolicyList(backupPolicyList, itemPath, policy)
    setBackupPolicyList(newBackupPolicyList)
  }

  return (
    <>
      {items.map((item) => (
        <TreeItem
          itemId={item.path}
          key={item.path}
          sx={{
            ["& .Mui-focused"]: {
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: alpha("#000000", 0.04),
              },
            },
          }}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {item.type === "directory" && <FolderOpenOutlined sx={{ mr: "0.5rem" }} />}
              <Typography
                children={item.root === true ? item.path : pathBasename(item.path)}
                sx={{ fontWeight: item.type === "directory" ? "bold" : "normal" }}
              />
              <Typography
                children={`(${humanReadableSize(item.size)})`}
                sx={{ ml: "0.5rem", fontSize: "0.8rem", fontWeight: "light" }}
              />
              <ToggleButtonGroup
                color="secondary"
                size="small"
                value={item.policy}
                sx={{
                  ml: "auto",
                  mr: "1.5rem",
                }}
              >
                {policyList.map((policy) => (
                  <ToggleButton
                    key={policy}
                    value={policy}
                    sx={{
                      fontSize: "0.8rem",
                      borderRadius: "12px",
                      padding: "0.1rem 0.4rem",
                      textTransform: "none",
                    }}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleChangePolicy(item.path, policy)
                    }}
                    children={policy}
                  />
                ))}
              </ToggleButtonGroup>
            </Box>
          }
          children={
            item.children ? <PolicyTreeItems items={item.children} /> : null
          }
        />
      ))}
    </>
  )
}
