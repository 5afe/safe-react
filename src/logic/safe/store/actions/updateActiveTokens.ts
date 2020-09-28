import { Set } from 'immutable'
import updateTokensList from './updateTokensList'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'

// the selector uses ownProps argument/router props to get the address of the safe
// so in order to use it I had to recreate the same structure
// const generateMatchProps = (safeAddress: string) => ({
//   match: {
//     params: {
//       [SAFE_PARAM_ADDRESS]: safeAddress,
//     },
//   },
// })

const updateActiveTokens = (safeAddress: string, activeTokens: Set<string>) => (dispatch: Dispatch): void => {
  dispatch(updateTokensList({ safeAddress, activeTokens }))
}

export default updateActiveTokens
