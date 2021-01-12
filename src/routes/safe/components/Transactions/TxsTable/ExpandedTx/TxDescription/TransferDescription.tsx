import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { EtherscanLink } from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'

import { TRANSACTIONS_DESC_SEND_TEST_ID } from './index'
import SendModal from 'src/routes/safe/components/Balances/SendModal'

interface TransferDescriptionProps {
  amountWithSymbol: string
  recipient?: string
  tokenAddress?: string
  rawAmount?: string
  isTokenTransfer: boolean
}

const TransferDescription = ({
  amountWithSymbol = '',
  recipient,
  tokenAddress,
  rawAmount,
  isTokenTransfer,
}: TransferDescriptionProps): ReactElement | null => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, recipient))
  const [sendModalOpen, setSendModalOpen] = React.useState(false)
  const sendModalOpenHandler = () => {
    setSendModalOpen(true)
  }

  return recipient ? (
    <>
      <Block data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
        <Bold>Send {amountWithSymbol} to:</Bold>
        {recipientName ? (
          <OwnerAddressTableCell
            address={recipient}
            knownAddress
            showLinks
            userName={recipientName}
            sendModalOpenHandler={isTokenTransfer ? sendModalOpenHandler : undefined}
          />
        ) : (
          <EtherscanLink
            knownAddress={false}
            value={recipient}
            sendModalOpenHandler={isTokenTransfer ? sendModalOpenHandler : undefined}
          />
        )}
      </Block>
      <SendModal
        activeScreenType="sendFunds"
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        recipientAddress={recipient}
        selectedToken={tokenAddress}
        tokenAmount={rawAmount}
      />
    </>
  ) : null
}

export default TransferDescription
