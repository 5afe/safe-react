//

import { getCurrentMasterContractLastVersion } from 'logic/safe/utils/safeVersion'
import setLatestMasterContractVersion from 'routes/safe/store/actions/setLatestMasterContractVersion'

const fetchLatestMasterContractVersion = () => async (dispatch) => {
  const latestVersion = await getCurrentMasterContractLastVersion()

  dispatch(setLatestMasterContractVersion(latestVersion))
}

export default fetchLatestMasterContractVersion
