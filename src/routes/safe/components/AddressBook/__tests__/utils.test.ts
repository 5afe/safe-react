import {
  WRONG_FILE_EXTENSION_ERROR,
  FILE_SIZE_TOO_BIG_ERROR,
  IMPORT_SUPPORTED_FORMATS,
  validateFile,
  validateCsvData,
  CsvDataType,
} from '../utils'

describe('Address Book file validations', () => {
  it('Should return wrong file extension error if file extension is not the allowed', () => {
    const file = new File([''], 'file.txt', { type: 'text/plain' })
    const result = validateFile(file)
    expect(result).toBe(WRONG_FILE_EXTENSION_ERROR)
  })

  it('Should return file size error if file size is over the allowed', () => {
    const file = new File([''], 'file.csv', { type: IMPORT_SUPPORTED_FORMATS[0] })
    Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 })
    const result = validateFile(file)
    expect(result).toBe(FILE_SIZE_TOO_BIG_ERROR)
  })

  it('Should return undefined if extension and file size are valid', () => {
    const file = new File([''], 'file.csv', { type: IMPORT_SUPPORTED_FORMATS[0] })
    const result = validateFile(file)
    expect(result).toBe(undefined)
  })
})

describe('Address Book CSV data validations', () => {
  const validAddress = '0x4362527986c3fD47f498eF24B4D01e6AAD7aBcb2'
  const noHexAddress = '4362527986c3fD47f498eF24B4D01e6AAD7aBcb2'
  const invalidAddress = '0xC1912fEE45d61C87Cc5EA59DaE31190FFFFfff2'
  const validName = 'Name'
  const validChainId = '4'
  it('Should return an error if the amount of columns is not valid', () => {
    const data: CsvDataType = [{ data: [validAddress, validName] }]
    const result = validateCsvData(data)
    expect(result).toBe('Invalid amount of columns on row 1')
  })

  it('Should return an error if name is empty', () => {
    const data = [{ data: [validAddress, '', validChainId] }]
    const result = validateCsvData(data)
    expect(result).toBe('Invalid amount of columns on row 1')
  })

  it('Should return an error if address is empty', () => {
    const data = [{ data: ['', validName, validChainId] }]
    const result = validateCsvData(data)
    expect(result).toBe('Invalid amount of columns on row 1')
  })

  it('Should return an error if chainId is empty', () => {
    const data = [{ data: [validAddress, validName, ''] }]
    const result = validateCsvData(data)
    expect(result).toBe('Invalid amount of columns on row 1')
  })

  it('Should return an error if address is not hex strict', () => {
    const data = [{ data: [noHexAddress, validName, validChainId] }]
    const result = validateCsvData(data)
    expect(result).toBe('Invalid address on row 1')
  })

  it('Should return an error if address is not valid', () => {
    const data = [{ data: [invalidAddress, validName, validChainId] }]
    const result = validateCsvData(data)
    expect(result).toBe('Invalid address on row 1')
  })

  it('Should return an error if chainId is not valid', () => {
    const data = [{ data: [validAddress, validName, 'notAChainId'] }]
    const result = validateCsvData(data)
    expect(result).toBe('Invalid chain id on row 1')
  })

  it('Should return undefined if all elements are valid', () => {
    const data = [{ data: [validAddress, validName, validChainId] }]
    const result = validateCsvData(data)
    expect(result).toBe(undefined)
  })
})
