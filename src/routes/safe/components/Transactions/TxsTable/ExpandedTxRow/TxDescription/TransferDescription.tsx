import React from 'react'
import { useSelector } from 'react-redux'

import { TRANSACTIONS_DESC_SEND_TEST_ID } from './index'
import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import EtherscanLink from 'src/components/EtherscanLink'

interface TransferDescriptionProps {
  amount: string
  recipient: string
}

const TransferDescription = ({ amount = '', recipient }: TransferDescriptionProps): React.ReactElement => {
  const recipientName = useSelector((state) => getNameFromAddressBook(state, recipient))
  return (
    <Block data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
      <Bold>Send {amount} to:</Bold>
      {recipientName ? (
        <OwnerAddressTableCell address={recipient} knownAddress showLinks userName={recipientName} />
      ) : (
        <EtherscanLink knownAddress={false} type="address" value={recipient} />
      )}
    </Block>
  )
}

export default TransferDescription
