import { Action, handleActions } from 'redux-actions'
import { MOBILE_PAIRING_ACTIONS } from '../actions'

export const MOBILE_PAIRING_REDUCER_ID = 'mobilePairing'

export type MobilePairingState = {
  isPaired: boolean
  uri: string
}

export const initialMobilePairingState: MobilePairingState = {
  isPaired: false,
  uri: '',
}

export type MobilePairingPayload = boolean | string

const mobilePairingReducer = handleActions<MobilePairingState, MobilePairingPayload>(
  {
    [MOBILE_PAIRING_ACTIONS.SET_URI]: (state, action: Action<string>) => {
      const uri = action.payload
      return { ...state, uri }
    },
    [MOBILE_PAIRING_ACTIONS.SET_PAIRED]: (state, action: Action<boolean>) => {
      const isPaired = action.payload
      return { ...state, isPaired }
    },
  },
  initialMobilePairingState,
)

export default mobilePairingReducer
