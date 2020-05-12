// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import setDefaultSafe from './setDefaultSafe'

import { getDefaultSafe } from '~/logic/safe/utils'
import { type GlobalState } from '~/store/index'
import { checksumAddress } from '~/utils/checksumAddress'

const loadDefaultSafe = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const defaultSafe: string = await getDefaultSafe()
    const checksumed = defaultSafe && defaultSafe.length > 0 ? checksumAddress(defaultSafe) : defaultSafe
    dispatch(setDefaultSafe(checksumed))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting default Safe from storage:', err)
  }
}

export default loadDefaultSafe
