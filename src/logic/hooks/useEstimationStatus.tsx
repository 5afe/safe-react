import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { EstimationStatus } from './useEstimateTransactionGas'
import { ButtonStatus } from 'src/components/Modal'

export const useEstimationStatus = (
  txEstimationStatus?: EstimationStatus,
): [buttonStatus: ButtonStatus, setButtonStatus: Dispatch<SetStateAction<ButtonStatus>>] => {
  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>(ButtonStatus.DISABLED)

  useEffect(() => {
    let mounted = true

    if (mounted) {
      switch (txEstimationStatus) {
        case EstimationStatus.LOADING:
          setButtonStatus(ButtonStatus.LOADING)
          break
        default:
          setButtonStatus(ButtonStatus.READY)
          break
      }
    }

    return () => {
      mounted = false
    }
  }, [txEstimationStatus])

  return [buttonStatus, setButtonStatus]
}
