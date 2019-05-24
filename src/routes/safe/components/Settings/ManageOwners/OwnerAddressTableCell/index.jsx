// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'

type Props = {
  address: string,
}

const OwnerAddressTableCell = (props: Props) => {
  const { address } = props
  return (
    <Block align="left">
      <Identicon address={address} diameter={32} />
      <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
    </Block>
  )
}

export default OwnerAddressTableCell
