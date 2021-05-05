import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { EstimationStatus } from './useEstimateTransactionGas'
import { ButtonStatus } from 'src/components/Modal'

export const useButtonStatus = (
  data?: string,
  txEstimationStatus?: EstimationStatus,
): [buttonStatus: ButtonStatus, setButtonStatus: Dispatch<SetStateAction<ButtonStatus>>] => {
  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>(ButtonStatus.DISABLED)

  useEffect(() => {
    let mounted = true

    if (data && txEstimationStatus !== EstimationStatus.LOADING) {
      mounted && setButtonStatus(ButtonStatus.READY)
    }

    if (txEstimationStatus === EstimationStatus.LOADING) {
      mounted && setButtonStatus(ButtonStatus.LOADING)
    }

    return () => {
      mounted = false
    }
  }, [data, txEstimationStatus])

  return [buttonStatus, setButtonStatus]
}
