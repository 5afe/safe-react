import { Dispatch } from 'redux'
import { getCurrentMasterContractLastVersion } from 'src/logic/safe/utils/safeVersion'
import setLatestMasterContractVersion from 'src/logic/safe/store/actions/setLatestMasterContractVersion'

const fetchLatestMasterContractVersion =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    const latestVersion = await getCurrentMasterContractLastVersion()

    dispatch(setLatestMasterContractVersion(latestVersion))
  }

export default fetchLatestMasterContractVersion
