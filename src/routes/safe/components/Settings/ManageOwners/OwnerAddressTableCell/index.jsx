// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import EtherScanLink from '~/components/EtherscanLink'

type Props = {
  address: string,
  showLinks?: boolean,
  knownAddress?: boolean,
  userName?: boolean,
}

const OwnerAddressTableCell = (props: Props) => {
  const { address, userName, showLinks, knownAddress } = props
  return (
    <Block justify="left">
      <Identicon address={address} diameter={32} />
      {showLinks ? (
        <div style={{ marginLeft: 10, flexShrink: 1, minWidth: 0 }}>
          {userName}
          <EtherScanLink type="address" value={address} knownAddress={knownAddress} />
        </div>
      ) : (
        <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
      )}
    </Block>
  )
}

export default OwnerAddressTableCell
