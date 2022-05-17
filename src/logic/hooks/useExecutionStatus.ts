import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEffect, useState } from 'react'
import useAsync from 'src/logic/hooks/useAsync'

export const useExecutionStatus = (
  checkTxExecution: () => Promise<boolean>,
  isExecution: boolean,
  txData: string,
  gasLimit: string | undefined,
): EstimationStatus => {
  const [executionStatus, setExecutionState] = useState<EstimationStatus>(EstimationStatus.LOADING)

  const [status, error, loading] = useAsync(async () => {
    if (!isExecution || !txData) return EstimationStatus.SUCCESS
    if (!gasLimit) return EstimationStatus.LOADING

    const success = await checkTxExecution()
    return success ? EstimationStatus.SUCCESS : EstimationStatus.FAILURE
  }, [checkTxExecution, isExecution, txData])

  useEffect(() => {
    if (loading) return

    status && setExecutionState(status)
    error && setExecutionState(EstimationStatus.FAILURE)
  }, [checkTxExecution, error, gasLimit, isExecution, loading, status, txData])

  return executionStatus
}
