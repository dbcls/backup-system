import { FolderOpenOutlined } from "@mui/icons-material"
import { Box, Typography, ToggleButtonGroup, ToggleButton } from "@mui/material"
import { TreeItem } from "@mui/x-tree-view/TreeItem"
import { useRecoilState } from "recoil"

import { backupPolicyAtom } from "@/store"
import { BackupPolicy } from "@/types"
import { humanReadableSize, pathBasename, updatePolicy } from "@/utils"
import { defaultPolicyList } from "@/utils"

interface PolicyTreeItemProps {
  items: BackupPolicy
  isRoot: boolean
}

export default function PolicyTreeItems({ items, isRoot }: PolicyTreeItemProps) {
  const [backupPolicy, setBackupPolicy] = useRecoilState(backupPolicyAtom)

  const handleChangePolicy = (itemPath: string, policy: string) => {
    const newBackupPolicy = updatePolicy(backupPolicy, itemPath, policy)
    setBackupPolicy(newBackupPolicy)
  }

  return (
    <>
      {items.map((item) => (
        <TreeItem
          itemId={item.path}
          key={item.path}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {item.type === "directory" && <FolderOpenOutlined sx={{ mr: "0.5rem" }} />}
              <Typography
                children={isRoot === true ? item.path : pathBasename(item.path)}
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
                {defaultPolicyList.map((policy) => (
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
            item.children ? <PolicyTreeItems items={item.children} isRoot={false} /> : null
          }
        />
      ))}
    </>
  )
}
