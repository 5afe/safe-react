// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { getDefaultSafe } from '~/logic/safe/utils'
import setDefaultSafe from './setDefaultSafe'
import { getWeb3 } from '~/logic/wallets/getWeb3'

const loadDefaultSafe = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const defaultSafe: string = await getDefaultSafe()
    const checksumed = getWeb3().utils.toChecksumAddress(defaultSafe)
    dispatch(setDefaultSafe(checksumed))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting default Safe from storage:', err)
  }
}

export default loadDefaultSafe
