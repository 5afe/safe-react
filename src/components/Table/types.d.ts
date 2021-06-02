export interface TableColumn {
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  custom: boolean
  disablePadding: boolean
  id: string
  label: string
  order: boolean
  static?: boolean
  style?: any
  formatTypeSort?: (value: string | number) => string | number
  width?: number
}
