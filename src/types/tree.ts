export interface TreeData {
  name: string
  key: string
  type: "folder" | "file"
  collapsed?: boolean
  children?: TreeData[]
  parent?: TreeData
  checked?: boolean
  loading?: boolean
}
