// @flow
import * as React from 'react'

import EtherScanLink from '~/components/EtherscanLink'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'

type Props = {
  address: string,
  showLinks?: boolean,
  knownAddress?: boolean,
  userName?: string,
}

const OwnerAddressTableCell = (props: Props) => {
  const { address, knownAddress, showLinks, userName } = props
  return (
    <Block justify="left">
      <Identicon address={address} diameter={32} />
      {showLinks ? (
        <div style={{ marginLeft: 10, flexShrink: 1, minWidth: 0 }}>
          {userName}
          <EtherScanLink knownAddress={knownAddress} type="address" value={address} />
        </div>
      ) : (
        <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
      )}
    </Block>
  )
}

export default OwnerAddressTableCell
