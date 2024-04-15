export interface FileSystemObj {
  path: string
  size: number
  type: "file" | "directory"
}

export interface PolicyObj extends FileSystemObj {
  children?: PolicyObj[]
  policy: string
}

export type BackupPolicy = PolicyObj[]
