import { SxProps } from "@mui/system"
import { Box, TextField, Checkbox, FormControlLabel } from "@mui/material"
import { useRecoilState } from "recoil"
import { s3ConfigAtom } from "@/store"
import { S3Config } from "@/types"

interface S3ConfigFormProps {
  sx?: SxProps
}

export default function S3ConfigForm({ sx }: S3ConfigFormProps) {
  const [s3Config, setS3Config] = useRecoilState(s3ConfigAtom)

  const setValue = (key: keyof S3Config, value: any) => {
    setS3Config({ ...s3Config, [key]: value })
  }

  return (
    <Box sx={{ ...sx, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <TextField
        label="Endpoint URL"
        color="secondary"
        size="small"
        sx={{ minWidth: "480px", maxWidth: "480px" }}
        value={s3Config.endpointUrl}
        onChange={(e) => setValue("endpointUrl", e.target.value)}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1.5rem" }}>
        <TextField
          label="Bucket Name"
          color="secondary"
          size="small"
          sx={{ minWidth: "480px", maxWidth: "480px" }}
          value={s3Config.bucketName}
          onChange={(e) => setValue("bucketName", e.target.value)}
        />
        <FormControlLabel label="Create bucket if not exists" control={
          <Checkbox
            checked={s3Config.createBucket}
            onChange={(e) => setValue("createBucket", e.target.checked)}
            sx={{
              color: "#3f51b5",
              "&.Mui-checked": {
                color: "#3f51b5",
              },
            }}
          />
        } />
      </Box>
      <TextField
        label="Access Key ID"
        color="secondary"
        size="small"
        sx={{ minWidth: "480px", maxWidth: "480px" }}
        value={s3Config.accessKeyId}
        onChange={(e) => setValue("accessKeyId", e.target.value)}
      />
      <TextField
        label="Secret Access Key"
        color="secondary"
        size="small"
        sx={{ minWidth: "480px", maxWidth: "480px" }}
        value={s3Config.secretAccessKey}
        onChange={(e) => setValue("secretAccessKey", e.target.value)}
      />
      <TextField
        label="HTTP Proxy (Optional)"
        color="secondary"
        size="small"
        sx={{ minWidth: "480px", maxWidth: "480px" }}
        value={s3Config.httpProxy}
        onChange={(e) => setValue("httpProxy", e.target.value)}
      />
    </Box >
  )
}
