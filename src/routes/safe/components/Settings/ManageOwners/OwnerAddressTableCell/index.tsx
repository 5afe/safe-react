import * as React from 'react'

import EtherScanLink from 'src/components/EtherscanLink'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'

const OwnerAddressTableCell = (props) => {
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
