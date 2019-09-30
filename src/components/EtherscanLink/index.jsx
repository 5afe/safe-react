// @flow
import React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { secondary } from '~/theme/variables'

const openIconStyle = {
  height: '13px',
  color: secondary,
}

type EtherscanLinkProps = {
  type: 'tx' | 'address',
  value: string,
}

const EtherscanLink = ({ type, value }: EtherscanLinkProps) => (
  <a href={getEtherScanLink(type, value)} target="_blank" rel="noopener noreferrer">
    {shortVersionOf(value, 4)}
    <OpenInNew style={openIconStyle} />
  </a>
)

export default EtherscanLink
