export type ParametersStatus = 'ENABLED' | 'DISABLED' | 'SAFE_DISABLED' | 'ETH_DISABLED'

export const areEthereumParamsEnabled = (parametersStatus: ParametersStatus): boolean => {
  return parametersStatus === 'ENABLED' || !(parametersStatus === 'ETH_DISABLED')
}

export const areSafeParamsEnabled = (parametersStatus: ParametersStatus): boolean => {
  return parametersStatus === 'ENABLED' || !(parametersStatus === 'SAFE_DISABLED')
}
