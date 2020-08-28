import EtherscanService from 'src/logic/contractInteraction/sources/EtherscanService'

const sources = {
  etherscan: new EtherscanService({ rps: 4 }),
}

export const getConfiguredSource = () => sources['etherscan']
