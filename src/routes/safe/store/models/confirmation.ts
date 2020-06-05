import { Record } from 'immutable'
import { ConfirmationProps } from './types/confirmation'

export const makeConfirmation = Record<ConfirmationProps>({
  owner: '',
  type: 'initialised',
  hash: '',
  signature: null,
})
