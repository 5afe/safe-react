import axios from 'axios'
import { getTxServiceUrl } from 'src/config'
import memoize from 'lodash.memoize'

export enum MasterCopyDeployer {
  GNOSIS = 'Gnosis',
  CIRCLE = 'Circle',
}

type MasterCopyFetch = {
  address: string
  version: string
}

export type MasterCopy = {
  address: string
  version: string
  deployer: MasterCopyDeployer
  deployerRepoUrl: string
}

const extractMasterCopyInfo = (mc: MasterCopyFetch): MasterCopy => {
  const dashIndex = mc.version.indexOf('-')

  const masterCopy = {
    address: mc.address,
    version: dashIndex === -1 ? mc.version : mc.version.substring(0, dashIndex),
    deployer: dashIndex === -1 ? MasterCopyDeployer.GNOSIS : MasterCopyDeployer.CIRCLE,
    deployerRepoUrl:
      dashIndex === -1
        ? 'https://github.com/gnosis/safe-contracts/releases'
        : 'https://github.com/CirclesUBI/safe-contracts/releases',
  }
  return masterCopy
}

export const fetchMasterCopies = memoize(
  async (): Promise<MasterCopy[] | undefined> => {
    const url = `${getTxServiceUrl()}/about/master-copies/`
    try {
      const res = await axios.get<{ address: string; version: string }[]>(url)
      return res.data.map(extractMasterCopyInfo)
    } catch (error) {
      console.error('Fetching data from master-copies errored', error)
    }
  },
)
