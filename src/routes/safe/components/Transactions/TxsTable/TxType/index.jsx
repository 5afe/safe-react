// 
import * as React from 'react'

import CustomTxIcon from './assets/custom.svg'
import IncomingTxIcon from './assets/incoming.svg'
import OutgoingTxIcon from './assets/outgoing.svg'
import SettingsTxIcon from './assets/settings.svg'

import { IconText } from '~/components-v2'
import { getAppInfo } from '~/routes/safe/components/Apps/appsList'
import { } from '~/routes/safe/store/models/transaction'

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

const TxType = ({ origin, txType }) => {
  const iconUrl = txType === 'third-party-app' ? getAppInfo(origin).iconUrl : typeToIcon[txType]
  const text = txType === 'third-party-app' ? getAppInfo(origin).name : typeToLabel[txType]

  return <IconText iconUrl={iconUrl} text={text} />
}
export default TxType
