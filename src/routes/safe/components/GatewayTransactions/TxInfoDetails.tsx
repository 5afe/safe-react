import React, { ReactElement, useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { getNetworkInfo } from 'src/config'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { TxLocationContext, TxLocationProps } from 'src/routes/safe/components/GatewayTransactions/TxLocationProvider'
import styled from 'styled-components'

import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import { Transfer } from 'src/logic/safe/store/models/types/gateway.d'
import { EllipsisTransactionDetails } from 'src/routes/safe/components/AddressBook/EllipsisTransactionDetails'
import SendModal from 'src/routes/safe/components/Balances/SendModal'

import { AddressInfo } from './AddressInfo'
import { InfoDetails } from './InfoDetails'

const ARow = styled.div`
  display: flex;
  align-items: flex-end;
`

const { nativeCoin } = getNetworkInfo()

type TxInfoDetailsProps = {
  title: string
  address: string
  canRepeatTransaction?: boolean
  transfer?: Transfer
  addressActions?: any[]
}

export const TxInfoDetails = ({ title, address, canRepeatTransaction, transfer }: TxInfoDetailsProps): ReactElement => {
  const { txLocation } = useContext<TxLocationProps>(TxLocationContext)
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, address))
  const [sendModalOpen, setSendModalOpen] = useState(false)
  const sendModalOpenHandler = () => {
    setSendModalOpen(true)
  }

  return (
    <InfoDetails title={title}>
      <ARow>
        <AddressInfo address={address} />
        <EllipsisTransactionDetails
          address={address}
          knownAddress={recipientName !== 'UNKNOWN'}
          sendModalOpenHandler={
            canRepeatTransaction && transfer && txLocation === 'history' && transfer.direction === 'OUTGOING'
              ? sendModalOpenHandler
              : undefined
          }
        />
      </ARow>
      {canRepeatTransaction && transfer && txLocation === 'history' && transfer.direction === 'OUTGOING' && (
        <SendModal
          activeScreenType={transfer.transferInfo.type === 'ERC721' ? 'sendCollectible' : 'sendFunds'}
          isOpen={sendModalOpen}
          onClose={() => setSendModalOpen(false)}
          recipientAddress={address}
          selectedToken={
            transfer.transferInfo.type === 'ERC20'
              ? transfer.transferInfo.tokenAddress
              : transfer.transferInfo.type === 'ERC721'
              ? transfer.transferInfo
              : nativeCoin.address
          }
          tokenAmount={
            transfer.transferInfo.type === 'ERC721'
              ? '1'
              : fromTokenUnit(
                  transfer.transferInfo.value,
                  Number(transfer.transferInfo.type === 'ERC20' ? transfer.transferInfo.decimals : nativeCoin.decimals),
                )
          }
        />
      )}
    </InfoDetails>
  )
}
