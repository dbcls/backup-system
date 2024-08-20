import { z } from "zod"

export interface FileSystemObj {
  path: string
  size: number
  type: "file" | "directory"
}

export const FileSystemObjSchema: z.ZodSchema<FileSystemObj> = z.object({
  path: z.string(),
  size: z.number(),
  type: z.enum(["file", "directory"]),
})

export const FileSystemObjArraySchema: z.ZodSchema<FileSystemObj[]> = z.array(FileSystemObjSchema)

export interface PolicyTreeNode extends FileSystemObj {
  children?: PolicyTreeNode[]
  policyId: string
}

export const PolicyTreeNodeSchema: z.ZodSchema<PolicyTreeNode> = z.object({
  path: z.string(),
  size: z.number(),
  type: z.enum(["file", "directory"]),
  children: z.array(z.lazy(() => PolicyTreeNodeSchema)).optional(),
  policyId: z.string(),
})

export type PolicyTree = PolicyTreeNode[]

export const PolicyTreeSchema: z.ZodSchema<PolicyTree> = z.array(PolicyTreeNodeSchema)

/*
* - id: ポリシーの ID
* - label: ポリシーの Label (Button に表示される文字列)
* - generation: 何世代分保持するか
* - interval: 何日ごとに full backup するか (e.g., daily なら 1, weekly なら 7)
* - diffRatio: incremental backup の差分データ量の割合 (0.01 なら 1%)
*   - 1 の場合、Full Backup となる
* - costPerMonth: GB あたりの 1 ヶ月分のコスト (USD、0.01 USD/GB/month なら 0.01)
* - constCost: 固定コスト (e.g., AWS EC2 インスタンス, 月額 USD)
*/
export interface PolicyConfig {
  id: string
  label: string
  generation: number
  interval: number
  diffRatio: number
  costPerMonth: number
  constCost: number
  type: "s3" | "rsync"
}

export const PolicyConfigSchema: z.ZodSchema<PolicyConfig> = z.object({
  id: z.string(),
  label: z.string(),
  generation: z.number(),
  interval: z.number(),
  diffRatio: z.number(),
  costPerMonth: z.number(),
  constCost: z.number(),
  type: z.enum(["s3", "rsync"]),
})

export const PolicyConfigsSchema: z.ZodSchema<PolicyConfig[]> = z.array(PolicyConfigSchema)

export interface S3Config {
  endpointUrl: string
  bucketName: string
  accessKeyId: string
  secretAccessKey: string
  httpProxy?: string
}

export const S3ConfigSchema: z.ZodSchema<S3Config> = z.object({
  endpointUrl: z.string(),
  bucketName: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  httpProxy: z.string().optional(),
})

// The version of the AppState below. Change this value if changing the definition below.
export const INTERFACE_VERSION = "1.0.0"

export interface AppState {
  general: {
    appVersion: string
    interfaceVersion: string
  }
  policyConfigs: PolicyConfig[]
  policyTree: PolicyTree
  s3Config: S3Config
}

export const AppStateSchema: z.ZodSchema<AppState> = z.object({
  general: z.object({
    appVersion: z.string(),
    interfaceVersion: z.string(),
  }),
  policyConfigs: z.array(PolicyConfigSchema),
  policyTree: PolicyTreeSchema,
  s3Config: S3ConfigSchema,
})

export interface BackupFile {
  path: string
  exclude: string[]
}

export interface BackupFiles {
  [key: string]: BackupFile[]
}
