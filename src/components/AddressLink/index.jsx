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

type AddressLinkProps = {
  address: string,
  currentNetwork: string,
}

const AddressLink = ({ address, currentNetwork }: AddressLinkProps) => (
  <a href={getEtherScanLink(address, currentNetwork)} target="_blank" rel="noopener noreferrer">
    {shortVersionOf(address, 4)}
    <OpenInNew style={openIconStyle} />
  </a>
)

export default connect<Object, Object, ?Function, ?Object>(
  state => ({ currentNetwork: networkSelector(state) }),
  null,
)(AddressLink)
