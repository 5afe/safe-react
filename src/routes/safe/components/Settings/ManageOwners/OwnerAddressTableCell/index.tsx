import * as React from 'react'
import { useEffect, useState } from 'react'

import EtherScanLink from 'src/components/EtherscanLink'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { getValidAddressBookName } from 'src/logic/addressBook/utils'
import { useWindowDimensions } from 'src/logic/hooks/useWindowDimensions'

type OwnerAddressTableCellProps = {
  address: string
  knownAddress?: boolean
  showLinks: boolean
  userName?: string
}

const OwnerAddressTableCell = (props: OwnerAddressTableCellProps): React.ReactElement => {
  const { address, knownAddress, showLinks, userName } = props
  const [cut, setCut] = useState(0)
  const { width } = useWindowDimensions()

  useEffect(() => {
    if (width <= 900) {
      setCut(6)
    } else if (width <= 1024) {
      setCut(12)
    } else {
      setCut(0)
    }
  }, [width])

  return (
    <Block justify="left">
      <Identicon address={address} diameter={32} />
      {showLinks ? (
        <div style={{ marginLeft: 10, flexShrink: 1, minWidth: 0 }}>
          {userName && getValidAddressBookName(userName)}
          <EtherScanLink knownAddress={knownAddress} value={address} cut={cut} />
        </div>
      ) : (
        <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
      )}
    </Block>
  )
}

export default OwnerAddressTableCell
