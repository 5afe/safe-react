import React, { useState, useEffect, FC, HTMLAttributes } from 'react'
import { useSelector } from 'react-redux'

import CustomTxIcon from './assets/custom.svg'
import IncomingTxIcon from './assets/incoming.svg'
import OutgoingTxIcon from './assets/outgoing.svg'
import SettingsTxIcon from './assets/settings.svg'

import CustomIconText from 'src/components/CustomIconText'
import { Custom, Transaction } from 'src/logic/safe/store/models/types/gateway'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { sameString } from 'src/utils/strings'
import { sameAddress } from 'src/logic/wallets/ethAddresses'

interface TxTypeProps {
  tx: Transaction
}

const isCancelTransaction = ({ txInfo, safeAddress }: { txInfo: Custom; safeAddress: string }): boolean =>
  sameAddress(txInfo.to, safeAddress) &&
  sameString(txInfo.dataSize, '0') &&
  sameString(txInfo.value, '0') &&
  txInfo.methodName === null

type TxType = {
  icon: string
  text: string
}

export const useTxType = (tx: Transaction): TxType => {
  const [type, setType] = useState<TxType>({ icon: CustomTxIcon, text: 'Custom transaction' })
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

export const TxType: FC<TxTypeProps & HTMLAttributes<unknown>> = ({ tx }) => {
  const { icon, text } = useTxType(tx)
  return <CustomIconText iconUrl={icon} text={text} />
}
