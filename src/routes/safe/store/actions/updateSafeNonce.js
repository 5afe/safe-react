// @flow
import { createAction } from 'redux-actions'

export const UPDATE_SAFE_NONCE = 'UPDATE_SAFE_NONCE'

const updateSafeNonce = createAction<string, *, *>(
  UPDATE_SAFE_NONCE,
  (safeAddress: string, nonce: number | string): any => ({
    safeAddress,
    nonce,
  }),
)

export default updateSafeNonce
