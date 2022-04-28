import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { estimateSafeTxGas } from 'src/logic/safe/transactions/gas'
import { currentSafe } from 'src/logic/safe/store/selectors'
import useAsync from 'src/logic/hooks/useAsync'

type UseEstimateSafeTxGasProps = {
  isRejectTx: boolean
  txData: string
  txRecipient: string
  txAmount: string
  operation?: Operation
}

export const useEstimateSafeTxGas = ({
  isRejectTx,
  txData,
  txRecipient,
  txAmount,
  operation,
}: UseEstimateSafeTxGasProps): { result: string; error: Error | undefined } => {
  const defaultEstimation = '0'
  const { address: safeAddress, currentVersion: safeVersion } = useSelector(currentSafe)

  const requestSafeTxGas = useCallback((): Promise<string> => {
    if (isRejectTx || !txData) return Promise.resolve(defaultEstimation)

    return estimateSafeTxGas(
      {
        safeAddress,
        txData,
        txRecipient,
        txAmount: txAmount || '0',
        operation: operation || Operation.CALL,
      },
      safeVersion,
    )
  }, [isRejectTx, operation, safeAddress, safeVersion, txAmount, txData, txRecipient])

  const { result, error } = useAsync<string>(requestSafeTxGas)

  return { result: result || defaultEstimation, error }
}
