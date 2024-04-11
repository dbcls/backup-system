export interface FileSystemObject {
  path: string
  size: number
  type: "file" | "directory"
  children?: FileSystemObject[]
  root?: boolean
  policy?: string
}
