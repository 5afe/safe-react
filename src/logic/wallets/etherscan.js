// @flow
export const getEtherScanLink = (type: 'address' | 'tx', value: string, network: string) => `https://${network === 'mainnet' ? '' : `${network}.`}etherscan.io/${type}/${value}`
