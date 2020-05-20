import { getCurrentMasterContractLastVersion } from 'src/logic/safe/utils/safeVersion'
import setLatestMasterContractVersion from 'src/routes/safe/store/actions/setLatestMasterContractVersion'

const fetchLatestMasterContractVersion = () => async (dispatch) => {
  const latestVersion = await getCurrentMasterContractLastVersion()

  dispatch(setLatestMasterContractVersion(latestVersion))
}

export default fetchLatestMasterContractVersion
