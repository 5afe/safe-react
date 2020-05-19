//

import { getCurrentMasterContractLastVersion } from 'logic/safe/utils/safeVersion'
import setLatestMasterContractVersion from 'routes/safe/store/actions/setLatestMasterContractVersion'
import {} from 'store'

const fetchLatestMasterContractVersion = () => async (dispatch) => {
  const latestVersion = await getCurrentMasterContractLastVersion()

  dispatch(setLatestMasterContractVersion(latestVersion))
}

export default fetchLatestMasterContractVersion
