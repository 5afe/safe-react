import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import CustomTxIcon from 'src/routes/safe/components/GatewayTransactions/assets/custom.svg'
import IncomingTxIcon from 'src/routes/safe/components/GatewayTransactions/assets/incoming.svg'
import OutgoingTxIcon from 'src/routes/safe/components/GatewayTransactions/assets/outgoing.svg'
import SettingsTxIcon from 'src/routes/safe/components/GatewayTransactions/assets/settings.svg'
import { isCancelTransaction } from 'src/routes/safe/components/GatewayTransactions/utils'

export type TxTypeProps = {
  icon: string
  text: string
}

export const useTransactionType = (tx: Transaction): TxTypeProps => {
  const [type, setType] = useState<TxTypeProps>({ icon: CustomTxIcon, text: 'Custom transaction' })
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

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
        if (!tx.executionInfo) {
          setType({ icon: SettingsTxIcon, text: 'Module' })
          break
        }

        if (isCancelTransaction({ txInfo: tx.txInfo, safeAddress })) {
          setType({ icon: CustomTxIcon, text: 'Cancelling transaction' })
          break
        }

        setType({ icon: CustomTxIcon, text: 'Custom transaction' })
        break
      }
    }
  }, [tx, safeAddress])

  return type
}
