// 

import setDefaultSafe from './setDefaultSafe'

import { getDefaultSafe } from 'src/logic/safe/utils'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { } from 'src/store/index'

const loadDefaultSafe = () => async (dispatch) => {
  try {
    const defaultSafe = await getDefaultSafe()
    const checksumed =
      defaultSafe && defaultSafe.length > 0 ? getWeb3().utils.toChecksumAddress(defaultSafe) : defaultSafe
    dispatch(setDefaultSafe(checksumed))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting default Safe from storage:', err)
  }
}

export default loadDefaultSafe
