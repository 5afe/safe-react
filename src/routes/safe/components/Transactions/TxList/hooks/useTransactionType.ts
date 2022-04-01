import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { isTxQueued, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import CustomTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/custom.svg'
import CircleCrossRed from 'src/routes/safe/components/Transactions/TxList/assets/circle-cross-red.svg'
import IncomingTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/incoming.svg'
import OutgoingTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/outgoing.svg'
import SettingsTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/settings.svg'
import { getTxTo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { useKnownAddress } from './useKnownAddress'
import { extractSafeAddress } from 'src/routes/routes'
import { currentSafe } from 'src/logic/safe/store/selectors'

export type TxTypeProps = {
  icon?: string
  fallbackIcon?: string
  text?: string
}

export const useTransactionType = (tx: Transaction): TxTypeProps => {
  const safe = useSelector(currentSafe)
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
        const { settingsInfo, dataDecoded } = tx.txInfo
        const icon = SettingsTxIcon

        switch (settingsInfo?.type) {
          case 'DELETE_GUARD': {
            // deleteGuard doesn't exist in Solidity
            // It is decoded as 'setGuard' with a settingsInfo.type of 'DELETE_GUARD'
            setType({ icon, text: 'deleteGuard' })
            break
          }
          case 'CHANGE_THRESHOLD': {
            setType({ icon, text: `${dataDecoded.method} (${settingsInfo.threshold}/n)` })
            break
          }
          case 'ADD_OWNER':
          case 'REMOVE_OWNER': {
            const newThreshold = settingsInfo.threshold
            const method = settingsInfo.type === 'ADD_OWNER' ? 'addOwner' : 'removeOwner'

            // We only have the current threshold as reference, therefore threshold/n
            setType({
              icon,
              text: safe.threshold === newThreshold ? method : `${method}ChangeThreshold (${newThreshold}/n)`,
            })
            break
          }
          default: {
            setType({ icon, text: dataDecoded.method })
            break
          }
        }
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
    safe.threshold,
  ])

  return type
}
