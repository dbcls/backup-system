import { Card, Box, Typography, Button } from "@mui/material"
import { SxProps } from "@mui/system"
import { SimpleTreeView } from "@mui/x-tree-view"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

import PolicyTreeItems from "@/components/PolicyTreeItems"
import { policyTreeAtom, policyConfigAtom, alertAtom } from "@/store"
import treeDataExample from "@/treeDataExample.jsonl?raw"
import { FileSystemObjArraySchema } from "@/types"
import { parseJsonLines, initPolicyTree } from "@/utils"

interface PolicyTreeProps {
  sx?: SxProps
}

export default function PolicyTree(props: PolicyTreeProps) {
  const [policyTree, setPolicyTree] = useRecoilState(policyTreeAtom)
  const policyConfig = useRecoilValue(policyConfigAtom)
  const setAlert = useSetRecoilState(alertAtom)

  const setExampleData = () => {
    const parseResult = FileSystemObjArraySchema.safeParse(parseJsonLines(treeDataExample))
    if (!parseResult.success) {
      setAlert(`example file の形式が正しくありません。 ${parseResult.error.message}`)
      return
    }
    const policyTree = initPolicyTree([], parseResult.data, policyConfig[0].id)
    setPolicyTree(policyTree)
  }

  return (
    <Card sx={{ ...props.sx, padding: "0.5rem" }} variant="outlined">
      {policyTree.length > 0 ? (
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
          defaultExpandedItems={policyTree.map((node) => node.path)}
          disabledItemsFocusable
          disableSelection
        >
          <PolicyTreeItems nodes={policyTree} isRoot={true} />
        </SimpleTreeView>
      ) : (
        <Box sx={{ margin: "0.5rem" }}>
          <Typography variant="body1">
            ここに File Tree が表示されます。上の "1. File List の読み込み" から読み込んでください。
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              mt: "1.5rem",
              textTransform: "none",
            }}
            onClick={() => setExampleData()}
            children="Example Data を読み込む"
          />
        </Box>
      )}
    </Card >
  )
}
