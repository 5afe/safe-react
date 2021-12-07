import { createSelector } from 'reselect'
import { AppReduxState } from 'src/store'
import { MOBILE_PAIRING_REDUCER_ID } from '../reducer'

export const mobilePairingState = (state: AppReduxState): AppReduxState[typeof MOBILE_PAIRING_REDUCER_ID] =>
  state[MOBILE_PAIRING_REDUCER_ID]

export const currentPaired = createSelector([mobilePairingState], (mobilePairing): boolean => {
  return mobilePairing.isPaired
})

export const currentPairingUri = createSelector([mobilePairingState], (mobilePairing): string => {
  return mobilePairing.uri
})
