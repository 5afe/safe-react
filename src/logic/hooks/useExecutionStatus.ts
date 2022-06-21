import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEffect, useState } from 'react'
import useAsync from 'src/logic/hooks/useAsync'

type Props = {
  checkTxExecution: () => Promise<boolean>
  isExecution: boolean
  txData: string
  gasLimit?: string
  gasPrice?: string
  gasMaxPrioFee?: string
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
    const isEstimationPending = !gasLimit || !gasPrice || !gasMaxPrioFee
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
