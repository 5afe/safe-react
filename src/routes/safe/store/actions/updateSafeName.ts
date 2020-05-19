//

import updateSafe from './updateSafe'

import {} from 'src/store'

const updateSafeName = (safeAddress, safeName) => async (dispatch) => {
  dispatch(updateSafe({ address: safeAddress, name: safeName }))
}

export default updateSafeName
