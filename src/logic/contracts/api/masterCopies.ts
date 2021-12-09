import axios from 'axios'
import { getMasterCopiesUrl } from 'src/config'

export enum MasterCopyDeployer {
  GNOSIS = 'Gnosis',
  CIRCLES = 'Circles',
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
  const isCircles = mc.version.toLowerCase().includes(MasterCopyDeployer.CIRCLES.toLowerCase())
  const dashIndex = mc.version.indexOf('-')

  const masterCopy = {
    address: mc.address,
    version: !isCircles ? mc.version : mc.version.substring(0, dashIndex),
    deployer: !isCircles ? MasterCopyDeployer.GNOSIS : MasterCopyDeployer.CIRCLES,
    deployerRepoUrl: !isCircles
      ? 'https://github.com/gnosis/safe-contracts/releases'
      : 'https://github.com/CirclesUBI/safe-contracts/releases',
  }
  return masterCopy
}

export const fetchMasterCopies = async (): Promise<MasterCopy[] | undefined> => {
  try {
    const res = await axios.get<{ address: string; version: string }[]>(getMasterCopiesUrl())
    return res.data.map(extractMasterCopyInfo)
  } catch (error) {
    console.error('Fetching data from master-copies errored', error)
  }
}
