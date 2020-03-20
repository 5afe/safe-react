// @flow
import type { Dispatch as ReduxDispatch } from 'redux'

import { getCurrentMasterContractLastVersion } from '~/logic/safe/utils/safeVersion'
import setLatestMasterContractVersion from '~/routes/safe/store/actions/setLatestMasterContractVersion'
import { type GlobalState } from '~/store'

const fetchLatestMasterContractVersion = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  const latestVersion = await getCurrentMasterContractLastVersion()

  dispatch(setLatestMasterContractVersion(latestVersion))
}

export default fetchLatestMasterContractVersion
