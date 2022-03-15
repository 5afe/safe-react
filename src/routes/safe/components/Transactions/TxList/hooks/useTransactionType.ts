import { useEffect, useState } from 'react'
import { isTxQueued, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import CustomTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/custom.svg'
import CircleCrossRed from 'src/routes/safe/components/Transactions/TxList/assets/circle-cross-red.svg'
import IncomingTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/incoming.svg'
import OutgoingTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/outgoing.svg'
import SettingsTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/settings.svg'
import { getTxTo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { useKnownAddress } from './useKnownAddress'
import { extractSafeAddress } from 'src/routes/routes'

export type TxTypeProps = {
  icon?: string
  fallbackIcon?: string
  text?: string
}

export const useTransactionType = (tx: Transaction): TxTypeProps => {
  const [type, setType] = useState<TxTypeProps>({ icon: CustomTxIcon, text: 'Contract interaction' })
  const safeAddress = extractSafeAddress()
  const toAddress = getTxTo(tx)
  const knownAddressBookAddress = useKnownAddress(toAddress)

  useEffect(() => {
    switch (tx.txInfo.type) {
      case 'Creation': {
        setType({ icon: toAddress?.logoUri || SettingsTxIcon, text: 'Safe created' })
        break
      }
      case 'Transfer': {
        const isSendTx = tx.txInfo.direction === 'OUTGOING'

        setType({
          icon: isSendTx ? OutgoingTxIcon : IncomingTxIcon,
          text: isSendTx ? (isTxQueued(tx.txStatus) ? 'Send' : 'Sent') : 'Received',
        })
        break
      }
      case 'SettingsChange': {
        // deleteGuard doesn't exist in Solidity
        // It is decoded as 'setGuard' with a settingsInfo.type of 'DELETE_GUARD'
        const isDeleteGuard = tx.txInfo.settingsInfo?.type === 'DELETE_GUARD'
        setType({ icon: SettingsTxIcon, text: isDeleteGuard ? 'deleteGuard' : tx.txInfo.dataDecoded.method })
        break
      }
      case 'Custom': {
        // TODO: is this the only way to identify a 'module' transaction?
        if (!tx.executionInfo) {
          setType({ icon: SettingsTxIcon, text: 'Module' })
          break
        }

        if (tx.txInfo.isCancellation) {
          setType({ icon: CircleCrossRed, text: 'On-chain rejection' })
          break
        }

        if (tx.safeAppInfo) {
          setType({ icon: tx.safeAppInfo.logoUri, text: tx.safeAppInfo.name })
          break
        }

        setType({
          icon: knownAddressBookAddress.isInAddressBook
            ? CustomTxIcon
            : knownAddressBookAddress.logoUri || toAddress?.logoUri || CustomTxIcon,
          fallbackIcon: knownAddressBookAddress.isInAddressBook ? undefined : CustomTxIcon,
          text: knownAddressBookAddress.name || toAddress?.name || 'Contract interaction',
        })
        break
      }
    }
  }, [
    tx,
    safeAddress,
    knownAddressBookAddress.name,
    knownAddressBookAddress.logoUri,
    knownAddressBookAddress.isInAddressBook,
    toAddress?.logoUri,
    toAddress?.name,
  ])

  return type
}
