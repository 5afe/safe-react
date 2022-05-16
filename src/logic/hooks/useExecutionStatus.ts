import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import { useEffect, useState } from 'react'

export const useExecutionStatus = (
  checkTxExecution: () => Promise<boolean>,
  isExecution: boolean,
  txData: string,
  gasLimit: string | undefined,
): EstimationStatus => {
  const [executionStatus, setExecutionState] = useState<EstimationStatus>(EstimationStatus.LOADING)

  useEffect(() => {
    let isCurrent = true

    if (!isExecution || !txData) {
      setExecutionState(EstimationStatus.SUCCESS)
      return
    }

    if (!gasLimit) return

    const checkExecutionStatus = async () => {
      const success = await checkTxExecution()
      isCurrent && setExecutionState(success ? EstimationStatus.SUCCESS : EstimationStatus.FAILURE)
    }

    checkExecutionStatus()

    return () => {
      isCurrent = false
    }
  }, [checkTxExecution, gasLimit, isExecution, txData])

  return executionStatus
}
