// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import EtherScanLink from '~/components/EtherscanLink'

type Props = {
  address: string,
  showLinks?: boolean,
}

const OwnerAddressTableCell = (props: Props) => {
  const { address, showLinks } = props
  return (
    <Block justify="left">
      <Identicon address={address} diameter={32} />
      <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
      { showLinks ? <EtherScanLink type="address" value={address} cut={8} /> : null }
    </Block>
  )
}

export default OwnerAddressTableCell
