export type ParametersStatus = 'ENABLED' | 'DISABLED' | 'SAFE_DISABLED' | 'ETH_HIDDEN' | 'CANCEL_TRANSACTION'

export const areEthereumParamsVisible = (parametersStatus: ParametersStatus): boolean => {
  return (
    parametersStatus === 'ENABLED' || (parametersStatus !== 'ETH_HIDDEN' && parametersStatus !== 'CANCEL_TRANSACTION')
  )
}

export const areSafeParamsEnabled = (parametersStatus: ParametersStatus): boolean => {
  return (
    parametersStatus === 'ENABLED' ||
    (parametersStatus !== 'SAFE_DISABLED' && parametersStatus !== 'CANCEL_TRANSACTION')
  )
}

export const ethereumTxParametersTitle = (isExecution: boolean): string => {
  return `Owner transaction ${isExecution ? '(Execution)' : '(On-chain approval)'}`
}
