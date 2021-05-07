import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Transaction, Custom } from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import CustomTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/custom.svg'
import CircleCrossRed from 'src/routes/safe/components/Transactions/TxList/assets/circle-cross-red.svg'
import IncomingTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/incoming.svg'
import OutgoingTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/outgoing.svg'
import SettingsTxIcon from 'src/routes/safe/components/Transactions/TxList/assets/settings.svg'
import { getTxTo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { useKnownAddress } from './useKnownAddress'

export type TxTypeProps = {
  icon?: string
  fallbackIcon?: string
  text?: string
}

export const useTransactionType = (tx: Transaction): TxTypeProps => {
  const [type, setType] = useState<TxTypeProps>({ icon: CustomTxIcon, text: 'Contract interaction' })
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const toAddress = getTxTo(tx)
  // Fixed casting because known address only works for Custom tx
  const knownAddress = useKnownAddress(toAddress || '0x', {
    name: (tx.txInfo as Custom)?.toInfo?.name,
    image: (tx.txInfo as Custom)?.toInfo?.logoUri || undefined,
  })

  useEffect(() => {
    switch (tx.txInfo.type) {
      case 'Creation': {
        setType({ icon: SettingsTxIcon, text: 'Safe created' })
        break
      }
      case 'Transfer': {
        const isSendTx = tx.txInfo.direction === 'OUTGOING'
        setType({ icon: isSendTx ? OutgoingTxIcon : IncomingTxIcon, text: isSendTx ? 'Send' : 'Receive' })
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
          setType({ icon: tx.safeAppInfo.logoUrl, text: tx.safeAppInfo.name })
          break
        }

        const toInfo = tx.txInfo.toInfo
        setType({
          icon: knownAddress.isAddressBook ? CustomTxIcon : knownAddress.image || CustomTxIcon,
          fallbackIcon: knownAddress.isAddressBook ? undefined : CustomTxIcon,
          text: toInfo ? knownAddress.name : 'Contract interaction',
        })
        break
      }
    }
  }, [tx, safeAddress, knownAddress.name, knownAddress.image, knownAddress.isAddressBook])

  return type
}
