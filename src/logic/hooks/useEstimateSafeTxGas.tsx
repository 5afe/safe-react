import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import { estimateSafeTxGas } from 'src/logic/safe/transactions/gas'
import { currentSafe } from 'src/logic/safe/store/selectors'
import useAsync from 'src/logic/hooks/useAsync'
import useSafeTxGas from 'src/routes/safe/components/Transactions/helpers/useSafeTxGas'

type UseEstimateSafeTxGasProps = {
  isCreation: boolean
  isRejectTx: boolean
  txData: string
  txRecipient: string
  txAmount: string
  operation?: Operation
}

export const useEstimateSafeTxGas = ({
  isCreation,
  isRejectTx,
  txData,
  txRecipient,
  txAmount,
  operation,
}: UseEstimateSafeTxGasProps): { error: Error | undefined; result: string } => {
  const defaultEstimation = '0'
  const { address: safeAddress, currentVersion: safeVersion } = useSelector(currentSafe)
  const needSafeTxGas = useSafeTxGas()

  const requestSafeTxGas = useCallback((): Promise<string> => {
    if (!isCreation || isRejectTx || !txData || !needSafeTxGas) {
      return Promise.resolve(defaultEstimation)
    }

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
  }, [isCreation, isRejectTx, operation, safeAddress, safeVersion, txAmount, txData, txRecipient, needSafeTxGas])

  const { result, error } = useAsync<string>(requestSafeTxGas)

  return { result: result || defaultEstimation, error }
}
