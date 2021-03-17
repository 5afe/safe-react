export type DataDecodedBasicParameter = {
  name: string
  type: string
  value: string
}
export type DataDecodedValue = {
  operation: 0 | 1
  to: string
  value: string
  data: string
  dataDecoded: {
    method: string
    parameters: DataDecodedBasicParameter[]
  } | null
}

export type DataDecodedParameter = {
  valueDecoded?: DataDecodedValue[]
} & DataDecodedBasicParameter

export type DataDecoded = {
  method: string
  parameters: DataDecodedParameter[]
}
