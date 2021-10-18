import { useEffect, useState } from 'react'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
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
  // Fixed casting because known address only works for Custom tx
  const knownAddressBookAddress = useKnownAddress(toAddress?.value || '0x', {
    name: toAddress?.name || undefined,
    image: toAddress?.logoUri || undefined,
  })

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
          text: knownAddressBookAddress.name || toAddress?.name || (isSendTx ? 'Send' : 'Receive'),
        })
        break
      }
      case 'SettingsChange': {
        setType({ icon: SettingsTxIcon, text: tx.txInfo.dataDecoded.method })
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
          icon: knownAddressBookAddress.isAddressBook
            ? CustomTxIcon
            : knownAddressBookAddress.image || toAddress?.logoUri || CustomTxIcon,
          fallbackIcon: knownAddressBookAddress.isAddressBook ? undefined : CustomTxIcon,
          text: knownAddressBookAddress.name || toAddress?.name || 'Contract interaction',
        })
        break
      }
    }
  }, [
    tx,
    safeAddress,
    knownAddressBookAddress.name,
    knownAddressBookAddress.image,
    knownAddressBookAddress.isAddressBook,
    toAddress?.logoUri,
    toAddress?.name,
  ])

  return type
}
