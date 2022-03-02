import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { estimateSafeTxGas } from 'src/logic/safe/transactions/gas'
import { currentSafe } from 'src/logic/safe/store/selectors'

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
}: UseEstimateSafeTxGasProps): string => {
  const [safeTxGasEstimation, setSafeTxGasEstimation] = useState<string>('0')
  const { address: safeAddress, currentVersion: safeVersion } = useSelector(currentSafe) ?? {}

  useEffect(() => {
    if (!isCreation || isRejectTx) return
    const estimateSafeTxGasCall = async () => {
      try {
        const safeTxGasEstimation = await estimateSafeTxGas(
          {
            safeAddress,
            txData,
            txRecipient,
            txAmount: txAmount || '0',
            operation: operation || Operation.CALL,
          },
          safeVersion,
        )
        setSafeTxGasEstimation(safeTxGasEstimation)
      } catch (error) {
        console.warn(error.message)
      }
    }
    estimateSafeTxGasCall()
  }, [isCreation, isRejectTx, operation, safeAddress, safeVersion, txAmount, txData, txRecipient])

  return safeTxGasEstimation
}
