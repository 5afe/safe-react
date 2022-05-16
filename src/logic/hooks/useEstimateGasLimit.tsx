import { useEffect, useState } from 'react'

const DEFAULT_GAS_LIMIT = '0'

export const useEstimateGasLimit = (
  estimationFn: () => Promise<number>,
  isExecution: boolean,
  txData: string,
  manualGasLimit: string | undefined,
): string | undefined => {
  const [gasLimit, setGasLimit] = useState<string | undefined>(manualGasLimit)

  useEffect(() => {
    let isCurrent = true

    if (manualGasLimit) {
      setGasLimit(manualGasLimit)
      return
    }

    if (!isExecution || !txData) {
      return
    }

    const estimateGasLimit = async () => {
      try {
        const estimation = await estimationFn()
        isCurrent && setGasLimit(estimation.toString())
      } catch (e) {
        console.log(e)
        setGasLimit(DEFAULT_GAS_LIMIT)
      }
    }

    estimateGasLimit()

    return () => {
      isCurrent = false
    }
  }, [estimationFn, isExecution, manualGasLimit, txData])

  return gasLimit
}
