export type ParametersStatus = 'ENABLED' | 'DISABLED' | 'SAFE_DISABLED' | 'ETH_DISABLED' | 'CANCEL_TRANSACTION'

export const areEthereumParamsEnabled = (parametersStatus: ParametersStatus): boolean => {
  return (
    parametersStatus === 'ENABLED' || (parametersStatus !== 'ETH_DISABLED' && parametersStatus !== 'CANCEL_TRANSACTION')
  )
}

export const areSafeParamsEnabled = (parametersStatus: ParametersStatus): boolean => {
  return (
    parametersStatus === 'ENABLED' ||
    (parametersStatus !== 'SAFE_DISABLED' && parametersStatus !== 'CANCEL_TRANSACTION')
  )
}
