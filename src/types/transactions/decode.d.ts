export type DecodedDataBasicParameter = {
  name: string
  type: string
  value: string
}
export type DecodedDataParameterValue = {
  operation: 0 | 1
  to: string
  value: string
  data: string
  dataDecoded: {
    method: string
    parameters: DecodedDataBasicParameter[]
  } | null
}

export type DecodedDataParameter = {
  valueDecoded?: DecodedDataParameterValue[]
} & DecodedDataBasicParameter

export type DecodedData = {
  method: string
  parameters: DecodedDataParameter[]
}
