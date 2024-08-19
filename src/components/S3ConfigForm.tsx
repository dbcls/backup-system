import { SxProps } from "@mui/system"
import { Box, TextField } from "@mui/material"
import { useRecoilState } from "recoil"
import { endpointUrlAtom, bucketNameAtom, accessKeyIdAtom, secretAccessKeyAtom } from "@/store"

interface S3ConfigFormProps {
  sx?: SxProps
}

export default function S3ConfigForm({ sx }: S3ConfigFormProps) {
  const [endpointUrl, setEndpointUrl] = useRecoilState(endpointUrlAtom)
  const [bucketName, setBucketName] = useRecoilState(bucketNameAtom)
  const [accessKeyId, setAccessKeyId] = useRecoilState(accessKeyIdAtom)
  const [secretAccessKey, setSecretAccessKey] = useRecoilState(secretAccessKeyAtom)

  return (
    <Box sx={{ ...sx, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <TextField label="Endpoint URL" color="secondary" size="small" sx={{ maxWidth: "480px" }} value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} />
      <TextField label="Bucket Name" color="secondary" size="small" sx={{ maxWidth: "480px" }} value={bucketName} onChange={(e) => setBucketName(e.target.value)} />
      <TextField label="Access Key ID" color="secondary" size="small" sx={{ maxWidth: "480px" }} value={accessKeyId} onChange={(e) => setAccessKeyId(e.target.value)} />
      <TextField label="Secret Access Key" color="secondary" size="small" sx={{ maxWidth: "480px" }} value={secretAccessKey} onChange={(e) => setSecretAccessKey(e.target.value)} />
    </Box>
  )
}
