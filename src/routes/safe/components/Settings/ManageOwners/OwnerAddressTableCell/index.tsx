import * as React from 'react'

import EtherScanLink from 'src/components/EtherscanLink'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { useWindowDimensions } from '../../../../container/hooks/useWindowDimensions'
import { useEffect, useState } from 'react'

const OwnerAddressTableCell = (props) => {
  const { address, knownAddress, showLinks, userName } = props
  const [cut, setCut] = useState(undefined)
  const { width } = useWindowDimensions()

  useEffect(() => {
    if (width <= 900) {
      setCut(6)
    } else if (width <= 1024) {
      setCut(12)
    } else {
      setCut(undefined)
    }
  }, [width])

  return (
    <Block justify="left">
      <Identicon address={address} diameter={32} />
      {showLinks ? (
        <div style={{ marginLeft: 10, flexShrink: 1, minWidth: 0 }}>
          {userName}
          <EtherScanLink knownAddress={knownAddress} type="address" value={address} cut={cut} />
        </div>
      ) : (
        <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
      )}
    </Block>
  )
}

export default OwnerAddressTableCell
