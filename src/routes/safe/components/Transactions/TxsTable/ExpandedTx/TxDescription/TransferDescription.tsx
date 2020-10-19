import React from 'react'
import { useSelector } from 'react-redux'
import EtherscanLink from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'

import { TRANSACTIONS_DESC_SEND_TEST_ID } from './index'

interface TransferDescriptionProps {
  amount: string
  recipient: string
}

const TransferDescription = ({ amount = '', recipient }: TransferDescriptionProps): React.ReactElement => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, recipient))
  return (
    <Block data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
      <Bold>Send {amount} to:</Bold>
      {recipientName ? (
        <OwnerAddressTableCell address={recipient} knownAddress showLinks userName={recipientName} />
      ) : (
        <EtherscanLink knownAddress={false} value={recipient} />
      )}
    </Block>
  )
}

export default TransferDescription
