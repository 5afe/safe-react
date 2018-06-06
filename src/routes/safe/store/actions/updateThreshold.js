// @flow
import { createAction } from 'redux-actions'

export const UPDATE_THRESHOLD = 'UPDATE_THRESHOLD'

type ThresholdProps = {
  safeAddress: string,
  threshold: number,
}

const updateDailyLimit = createAction(
  UPDATE_THRESHOLD,
  (safeAddress: string, threshold: number): ThresholdProps => ({
    safeAddress,
    threshold: Number(threshold),
  }),
)

export default updateDailyLimit
