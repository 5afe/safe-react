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

const updateActiveAssets = (safeAddress, activeAssets) => async (dispatch) => {
  dispatch(updateSafe({ address: safeAddress, activeAssets }))
}

export default updateActiveAssets
