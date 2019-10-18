// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store/index'
import { getDefaultSafe } from '~/logic/safe/utils'
import setDefaultSafe from './setDefaultSafe'

const loadDefaultSafe = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const defaultSafe: string = await getDefaultSafe()

    dispatch(setDefaultSafe(defaultSafe))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting defautl Safe from storage:', err)
  }
}

export default loadDefaultSafe
