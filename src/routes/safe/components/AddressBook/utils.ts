import { isValidAddress } from 'src/utils/isValidAddress'
import { isValidChainId } from 'src/config'

export const WRONG_FILE_EXTENSION_ERROR = 'Only CSV files are allowed'
export const FILE_SIZE_TOO_BIG_ERROR = 'The size of the file is over 1 MB'

const FILE_BYTES_LIMIT = 1000000
const IMPORT_SUPPORTED_FORMATS = [
  '',
  'text/csv',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]
const CSV_EXTENSION_REGEX = /[^.]+\.(txt|csv|tsv|ods|xls|xlsx)$/

export type CsvDataType = { data: string[] }[]

export const validateFile = (file: File): string | undefined => {
  if (!IMPORT_SUPPORTED_FORMATS.includes(file.type) || !CSV_EXTENSION_REGEX.test(file.name.toLowerCase())) {
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
    if (!isValidChainId(chainId.trim())) {
      return `Invalid chain id on row ${index + 1}`
    }
  }
  return
}
