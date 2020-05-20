import updateSafe from './updateSafe'

const updateSafeName = (safeAddress, safeName) => async (dispatch) => {
  dispatch(updateSafe({ address: safeAddress, name: safeName }))
}

export default updateSafeName
