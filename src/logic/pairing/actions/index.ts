import { createAction } from 'redux-actions'
import { PairingState } from '../reducer'

export enum PAIRING_ACTIONS {
  SET_STATE = 'pairing/setState',
  SET_URI = 'pairing/setUri',
  SET_PAIRED = 'pairing/setPaired',
}

export const setPairingState = createAction<PairingState>(PAIRING_ACTIONS.SET_STATE)
export const setPairingUri = createAction<string>(PAIRING_ACTIONS.SET_URI)
export const setPairingPaired = createAction<boolean>(PAIRING_ACTIONS.SET_PAIRED)
