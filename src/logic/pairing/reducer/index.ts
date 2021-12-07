import { Action, handleActions } from 'redux-actions'
import { PAIRING_ACTIONS } from '../actions'

export const PAIRING_REDUCER_ID = 'pairing'

export type PairingState = {
  isPaired: boolean
  uri: string
}

export const initialPairingState: PairingState = {
  isPaired: false,
  uri: '',
}

export type PairingPayload = PairingState | boolean | string

const logUri = (uri: string) => {
  if (uri) {
    console.log(`Pairing URI: ${uri}`)
  }
}

const pairingReducer = handleActions<PairingState, PairingPayload>(
  {
    [PAIRING_ACTIONS.SET_STATE]: (_state, action: Action<PairingState>) => {
      const newState = action.payload
      logUri(newState.uri)
      return action.payload
    },
    [PAIRING_ACTIONS.SET_URI]: (state, action: Action<string>) => {
      const uri = action.payload
      logUri(uri)
      return { ...state, uri }
    },
    [PAIRING_ACTIONS.SET_PAIRED]: (state, action: Action<boolean>) => {
      const isPaired = action.payload
      return { ...state, isPaired }
    },
  },
  initialPairingState,
)

export default pairingReducer
