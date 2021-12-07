import { createAction } from 'redux-actions'

export enum MOBILE_PAIRING_ACTIONS {
  SET_URI = 'mobilePairing/setUri',
  SET_PAIRED = 'mobilePairing/setPaired',
}

export const setMobilePairingUri = createAction<string>(MOBILE_PAIRING_ACTIONS.SET_URI)
export const setMobilePairingPaired = createAction<boolean>(MOBILE_PAIRING_ACTIONS.SET_PAIRED)
