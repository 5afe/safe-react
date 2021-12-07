import { createSelector } from 'reselect'
import { AppReduxState } from 'src/store'
import { PAIRING_REDUCER_ID } from '../reducer'

export const pairingState = (state: AppReduxState): AppReduxState[typeof PAIRING_REDUCER_ID] =>
  state[PAIRING_REDUCER_ID]

export const pairingStatus = createSelector([pairingState], ({ isPaired }): boolean => {
  return isPaired
})

export const currentPairingUri = createSelector([pairingState], ({ uri }): string => {
  return uri
})
