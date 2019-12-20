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
      { showLinks ? (
        <div style={{ marginLeft: 10}}>
          <EtherScanLink type="address" value={address} />
        </div>
      ) : <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph> }
    </Block>
  )
}

export default OwnerAddressTableCell
