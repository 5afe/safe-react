import * as React from 'react'
import { useEffect, useState } from 'react'

import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import { getValidAddressBookName } from 'src/logic/addressBook/utils'
import { useWindowDimensions } from 'src/logic/hooks/useWindowDimensions'
import { EtherscanLink } from 'src/components/EtherscanLink'

type OwnerAddressTableCellProps = {
  address: string
  knownAddress?: boolean
  showLinks: boolean
  userName?: string
  sendModalOpenHandler?: () => void
}

const OwnerAddressTableCell = (props: OwnerAddressTableCellProps): React.ReactElement => {
  const { address, knownAddress, showLinks, userName, sendModalOpenHandler } = props
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
          <EtherscanLink
            knownAddress={knownAddress}
            value={address}
            cut={cut}
            sendModalOpenHandler={sendModalOpenHandler}
          />
        </div>
      ) : (
        <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
      )}
    </Block>
  )
}

export default OwnerAddressTableCell
