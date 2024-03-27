import { Card } from "@mui/material"
import { SxProps } from "@mui/system"
import { SimpleTreeView } from "@mui/x-tree-view"

import PolicyTreeItems from "@/components/PolicyTreeItems"
import treeDataExample from "@/treeDataExample.json"
import { FileSystemObject } from "@/types"

interface PolicyTreeProps {
  sx?: SxProps
}

export default function PolicyTree(props: PolicyTreeProps) {
  console.log(treeDataExample)
  return (
    <Card sx={{ ...props.sx }}>
      <SimpleTreeView sx={{ height: "fit-content", flexGrow: 1 }}>
        <PolicyTreeItems items={treeDataExample as unknown as FileSystemObject[]} />
      </SimpleTreeView>
    </Card>
  )
}
