// @flow
import React from 'react'
import { connect } from 'react-redux'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { secondary } from '~/theme/variables'
import { networkSelector } from '~/logic/wallets/store/selectors'

const openIconStyle = {
  height: '13px',
  color: secondary,
}

type EtherscanLinkProps = {
  type: 'tx' | 'address',
  value: string,
  currentNetwork: string,
}

const EtherscanLink = ({ type, value, currentNetwork }: EtherscanLinkProps) => (
  <a href={getEtherScanLink(type, value, currentNetwork)} target="_blank" rel="noopener noreferrer">
    {shortVersionOf(value, 4)}
    <OpenInNew style={openIconStyle} />
  </a>
)

export default connect<Object, Object, ?Function, ?Object>(
  state => ({ currentNetwork: networkSelector(state) }),
  null,
)(EtherscanLink)
