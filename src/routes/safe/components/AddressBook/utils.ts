import { isValidAddress } from 'src/utils/isValidAddress'

export const WRONG_FILE_EXTENSION_ERROR = 'Only CSV files are allowed'
export const FILE_SIZE_TOO_BIG_ERROR = 'The size of the file is over 1 MB'
export const FILE_BYTES_LIMIT = 1000000
export const IMPORT_SUPPORTED_FORMATS = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

export type CsvDataType = { data: string[] }[]

export const validateFile = (file: File): string | undefined => {
  if (!IMPORT_SUPPORTED_FORMATS.includes(file.type)) {
    return WRONG_FILE_EXTENSION_ERROR
  }

  if (file.size >= FILE_BYTES_LIMIT) {
    return FILE_SIZE_TOO_BIG_ERROR
  }

  return
}

export const validateCsvData = (data: CsvDataType): string | undefined => {
  for (let index = 0; index < data.length; index++) {
    const entry = data[index]
    const [address, name, chainId] = entry.data
    if (entry.data.length !== 3) {
      return `Invalid amount of columns on row ${index + 1}`
    }
    if (typeof address !== 'string' || typeof name !== 'string' || typeof chainId !== 'string') {
      return `Invalid amount of columns on row ${index + 1}`
    }
    if (!address.trim() || !name.trim() || !chainId.trim()) {
      return `Invalid amount of columns on row ${index + 1}`
    }
    // Verify address properties
    const lowerCaseAddress = address.toLowerCase()
    if (!isValidAddress(lowerCaseAddress)) {
      return `Invalid address on row ${index + 1}`
    }
    if (isNaN(parseInt(chainId))) {
      return `Invalid chain id on row ${index + 1}`
    }
  }
  return
}
