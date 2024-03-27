import { Box, ToggleButton, ToggleButtonGroup, Divider } from "@mui/material"
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem"

import { FileSystemObject } from "@/types"

interface PolicyTreeItemProps {
  items: FileSystemObject[]
}

const humanReadableSize = (size: number) => {
  if (size === 0) return "0.00 B"
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "KB", "MB", "GB", "TB", "PB"][i]}`
}

export default function PolicyTreeItems({ items }: PolicyTreeItemProps) {
  return (
    <>
      {items.map((item) => (
        <TreeItem
          itemId={item.path}
          key={item.path}
          label={<Box>
            <Box sx={{
              display: "inline-flex", alignItems: "center", border: "1px solid", borderColor: "divider", borderRadius: 2,
              marginRight: "1rem",
            }} >
              <Box sx={{ margin: "0.2rem 0.4rem" }}>Policy1</Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ margin: "0.2rem 0.4rem" }}>Policy2</Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ margin: "0.2rem 0.4rem" }}>Policy3</Box>
            </Box>
            {item.type === "file" ? item.path : <strong>{item.path}</strong>}
            {item.size ? ` (${humanReadableSize(item.size)})` : null}
          </Box>}
          // sx={{
          //   position: "relative",
          //   [`& .${treeItemClasses.content}`]: {
          //     flexDirection: "row-reverse",
          //     marginTop: "0.5rem",
          //     marginBottom: "0.5rem",
          //     padding: "0.5rem",
          //     paddingRight: "1rem",
          //     // ["&.Mui-expanded "]: {
          //     //   "&::before": {
          //     //     content: "\"\"",
          //     //     display: "block",
          //     //     position: "absolute",
          //     //     left: "16px",
          //     //     top: "44px",
          //     //     height: "calc(100% - 48px)",
          //     //     width: "1.5px",
          //     //     backgroundColor: "#888",
          //     //   },
          //     // },
          //   },
          //   [`& .${treeItemClasses.groupTransition}`]: {
          //     marginLeft: 15,
          //     // paddingLeft: 18,
          //     borderLeft: "1.5px solid #9E9E9E",
          //   },
          // }}
          children={
            item.children ? <PolicyTreeItems items={item.children} /> : null
          } />
      ))}
    </>
  )
}
