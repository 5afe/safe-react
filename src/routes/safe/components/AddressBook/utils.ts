import { isValidAddress } from 'src/utils/isValidAddress'

const WRONG_FILE_EXTENSION_ERROR = 'Only CSV files are allowed'
const FILE_SIZE_TOO_BIG = 'The size of the file is over 1 MB'
const FILE_BYTES_LIMIT = 1000000
const IMPORT_SUPPORTED_FORMATS = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
]

export const validateFile = (file: File): string | undefined => {
  if (!IMPORT_SUPPORTED_FORMATS.includes(file.type)) {
    return WRONG_FILE_EXTENSION_ERROR
  }

  if (file.size >= FILE_BYTES_LIMIT) {
    return FILE_SIZE_TOO_BIG
  }

  return
}

export const validateCsvData = (data: { data: string[] }[]): string | undefined => {
  for (let index = 0; index < data.length; index++) {
    const entry = data[index]
    if (!entry.data[0] || !entry.data[1] || !entry.data[2]) {
      return `Invalid amount of columns on row ${index + 1}`
    }
    // Verify address properties
    const address = entry.data[0].toLowerCase()
    if (!isValidAddress(address)) {
      return `Invalid address on row ${index + 1}`
    }
    if (isNaN(parseInt(entry.data[2]))) {
      return `Invalid chain id on row ${index + 1}`
    }
  }
  return
}
