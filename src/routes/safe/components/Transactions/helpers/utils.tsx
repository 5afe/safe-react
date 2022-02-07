import { getNativeCurrency } from 'src/config'
import { sameString } from 'src/utils/strings'

export type ParametersStatus = 'ENABLED' | 'DISABLED' | 'SAFE_DISABLED' | 'ETH_HIDDEN' | 'CANCEL_TRANSACTION'

export const areEthereumParamsVisible = (parametersStatus: ParametersStatus): boolean => {
  return parametersStatus === 'ENABLED' || parametersStatus !== 'ETH_HIDDEN'
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

export const getInteractionTitle = (value: number | string): string => {
  if (Number(value) === 0) {
    return 'Interact with:'
  }

  const { symbol } = getNativeCurrency()
  return `Interact with (and send ${value} ${symbol} to):`
}

export const isSpendingLimit = (txType?: string): boolean => sameString(txType, 'spendingLimit')
