import { DEFAULT_GAS, EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEffect, useState } from 'react'
import useAsync from 'src/logic/hooks/useAsync'
import { DEFAULT_GAS_LIMIT } from 'src/logic/hooks/useEstimateGasLimit'

type Props = {
  checkTxExecution: () => Promise<boolean>
  isExecution: boolean
  txData: string
  gasLimit: string | undefined
  gasPrice: string
  gasMaxPrioFee: string
}

export const useExecutionStatus = ({
  checkTxExecution,
  isExecution,
  txData,
  gasLimit,
  gasPrice,
  gasMaxPrioFee,
}: Props): EstimationStatus => {
  const [executionStatus, setExecutionState] = useState<EstimationStatus>(EstimationStatus.LOADING)

  const [status, error, loading] = useAsync(async () => {
    if (!isExecution || !txData) return EstimationStatus.SUCCESS
    const isEstimationPending =
      !gasLimit || gasLimit === DEFAULT_GAS_LIMIT || gasPrice === DEFAULT_GAS || gasMaxPrioFee === DEFAULT_GAS
    if (isEstimationPending) return EstimationStatus.LOADING

    const success = await checkTxExecution()
    return success ? EstimationStatus.SUCCESS : EstimationStatus.FAILURE
  }, [checkTxExecution, isExecution, txData, gasPrice, gasMaxPrioFee])

  useEffect(() => {
    if (loading) return

    status && setExecutionState(status)
    error && setExecutionState(EstimationStatus.FAILURE)
  }, [checkTxExecution, error, gasLimit, isExecution, loading, status, txData])

  return executionStatus
}
