import setDefaultSafe from './setDefaultSafe'

import { getDefaultSafe } from 'src/logic/safe/utils'

import { checksumAddress } from 'src/utils/checksumAddress'
import { Dispatch } from 'redux'

const loadDefaultSafe = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    const defaultSafe = await getDefaultSafe()
    const checksumed = defaultSafe && defaultSafe.length > 0 ? checksumAddress(defaultSafe) : defaultSafe
    dispatch(setDefaultSafe(checksumed))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting default Safe from storage:', err)
  }
}

export default loadDefaultSafe
