import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { EstimationStatus } from './useEstimateTransactionGas'
import { ButtonStatus } from 'src/components/Modal'

export const useEstimationStatus = (
  txEstimationStatus: EstimationStatus,
): [buttonStatus: ButtonStatus, setButtonStatus: Dispatch<SetStateAction<ButtonStatus>>] => {
  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>(ButtonStatus.DISABLED)

  useEffect(() => {
    let mounted = true

    if (txEstimationStatus === EstimationStatus.LOADING) {
      mounted && setButtonStatus(ButtonStatus.LOADING)
    } else {
      mounted && setButtonStatus(ButtonStatus.READY)
    }

    return () => {
      mounted = false
    }
  }, [txEstimationStatus])

  return [buttonStatus, setButtonStatus]
}
