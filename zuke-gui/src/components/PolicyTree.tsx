import { Card } from "@mui/material"
import { SxProps } from "@mui/system"
import { SimpleTreeView } from "@mui/x-tree-view"
import { useRecoilValue } from "recoil"

import PolicyTreeItems from "@/components/PolicyTreeItems"
import { backupPolicyListAtom } from "@/store"

interface PolicyTreeProps {
  sx?: SxProps
}

export default function PolicyTree(props: PolicyTreeProps) {
  const backupPolicyList = useRecoilValue(backupPolicyListAtom)

  return (
    <Card sx={{ ...props.sx, padding: "0.5rem" }} >
      <SimpleTreeView
        sx={{
          ["& .MuiCollapse-root"]: {
            position: "relative",
            pl: "2rem",
            "&::before": {
              content: "\"\"",
              position: "absolute",
              left: 20,
              top: 12,
              bottom: 12,
              width: "1.5px",
              backgroundColor: "#9e9e9e",
            },
          },
          ["& .MuiTreeItem-iconContainer"]: {
            order: 1,
          },
        }}
        disabledItemsFocusable
        disableSelection
      >
        <PolicyTreeItems items={backupPolicyList} />
      </SimpleTreeView>
    </Card >
  )
}
