import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { Erc721Transfer, Transfer } from 'src/logic/safe/store/models/types/gateway.d'
import { EllipsisTransactionDetails } from 'src/routes/safe/components/AddressBook/EllipsisTransactionDetails'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { AddressInfo } from './AddressInfo'
import { InfoDetails } from './InfoDetails'
import { TxLocationContext, TxLocationProps } from './TxLocationProvider'
import { getTxTokenData } from './utils'

const SingleRow = styled.div`
  display: flex;
  align-items: flex-end;
`

type TxInfoDetailsProps = {
  title: string
  address: string
  isTransferType?: boolean
  txInfo?: Transfer
}

export const TxInfoDetails = ({ title, address, isTransferType, txInfo }: TxInfoDetailsProps): ReactElement => {
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, address))
  const knownAddress = recipientName !== 'UNKNOWN'

  const { txLocation } = useContext<TxLocationProps>(TxLocationContext)
  const canRepeatTransaction = isTransferType && txLocation === 'history' && txInfo?.direction === 'OUTGOING'

  const [sendModalOpen, setSendModalOpen] = useState(false)
  const sendModalOpenHandler = () => {
    setSendModalOpen(true)
  }
  const onClose = () => {
    setSendModalOpen(false)
  }

  const [sendModalParams, setSendModalParams] = useState<{
    activeScreenType: 'sendCollectible' | 'sendFunds'
    recipientAddress: string
    selectedToken: string | Erc721Transfer
    tokenAmount: string
  }>({
    activeScreenType: 'sendFunds',
    recipientAddress: address,
    selectedToken: ZERO_ADDRESS,
    tokenAmount: '0',
  })
  useEffect(() => {
    if (txInfo) {
      const isCollectible = txInfo.transferInfo.type === 'ERC721'
      const { address, value, decimals } = getTxTokenData(txInfo)

      setSendModalParams((prev) => ({
        ...prev,
        activeScreenType: isCollectible ? 'sendCollectible' : 'sendFunds',
        selectedToken: isCollectible ? (txInfo.transferInfo as Erc721Transfer) : address,
        tokenAmount: isCollectible ? '1' : fromTokenUnit(value, Number(decimals)),
      }))
    }
  }, [txInfo])

  return (
    <InfoDetails title={title}>
      <SingleRow>
        <AddressInfo address={address} />
        <EllipsisTransactionDetails
          address={address}
          knownAddress={knownAddress}
          sendModalOpenHandler={canRepeatTransaction ? sendModalOpenHandler : undefined}
        />
      </SingleRow>
      {canRepeatTransaction && <SendModal isOpen={sendModalOpen} onClose={onClose} {...sendModalParams} />}
    </InfoDetails>
  )
}
