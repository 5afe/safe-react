// @flow
import { Set } from 'immutable'
import type { Dispatch as ReduxDispatch } from 'redux'
import { type GlobalState } from '~/store'
import updateSafe from './updateSafe'

// the selector uses ownProps argument/router props to get the address of the safe
// so in order to use it I had to recreate the same structure
// const generateMatchProps = (safeAddress: string) => ({
//   match: {
//     params: {
//       [SAFE_PARAM_ADDRESS]: safeAddress,
//     },
//   },
// })

const updateActiveTokens = (safeAddress: string, activeTokens: Set<string>) => async (
  dispatch: ReduxDispatch<GlobalState>,
) => {
  dispatch(updateSafe({ address: safeAddress, activeTokens }))
}

export default updateActiveTokens
