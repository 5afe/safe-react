// @flow
import { createAction } from 'redux-actions'

export const SET_LATEST_MASTER_CONTRACT_VERSION = 'SET_LATEST_MASTER_CONTRACT_VERSION'

const setLatestMasterContractVersion = createAction<string, *>(SET_LATEST_MASTER_CONTRACT_VERSION)

export default setLatestMasterContractVersion
