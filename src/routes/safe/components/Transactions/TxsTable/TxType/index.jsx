// @flow
import * as React from 'react'
import { type TransactionType } from '~/routes/safe/store/models/transaction'
import { getAppInfo } from '~/routes/safe/components/Apps/appsList'
import { IconText } from '~/components-v2'

import OutgoingTxIcon from './assets/outgoing.svg'
import IncomingTxIcon from './assets/incoming.svg'
import CustomTxIcon from './assets/custom.svg'
import SettingsTxIcon from './assets/settings.svg'

const typeToIcon = {
  outgoing: OutgoingTxIcon,
  incoming: IncomingTxIcon,
  custom: CustomTxIcon,
  settings: SettingsTxIcon,
  creation: SettingsTxIcon,
  cancellation: SettingsTxIcon,
  upgrade: SettingsTxIcon,
}

const typeToLabel = {
  outgoing: 'Outgoing transfer',
  incoming: 'Incoming transfer',
  custom: 'Custom transaction',
  settings: 'Modify settings',
  creation: 'Safe created',
  cancellation: 'Cancellation transaction',
  upgrade: 'Contract Upgrade',
}

const TxType = ({ txType, origin }: { txType: TransactionType, origin: string | null }) => {
  const getIcon = type => {
    return type === 'third-party-app' ? getAppInfo(origin).iconUrl : typeToIcon[type]
  }

  const getLabel = type => {
    return type === 'third-party-app' ? origin : typeToLabel[type]
  }

  return <IconText iconUrl={getIcon(txType)} text={getLabel(txType)} />
}

export default TxType
