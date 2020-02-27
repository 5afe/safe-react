// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import setDefaultSafe from './setDefaultSafe'

import { getDefaultSafe } from '~/logic/safe/utils'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type GlobalState } from '~/store/index'

const loadDefaultSafe = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const defaultSafe: string = await getDefaultSafe()
    const checksumed =
      defaultSafe && defaultSafe.length > 0 ? getWeb3().utils.toChecksumAddress(defaultSafe) : defaultSafe
    dispatch(setDefaultSafe(checksumed))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting default Safe from storage:', err)
  }
}

export default loadDefaultSafe
