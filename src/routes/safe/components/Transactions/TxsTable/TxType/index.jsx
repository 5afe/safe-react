// @flow
import React, { useEffect, useState } from 'react'

import CustomTxIcon from './assets/custom.svg'
import IncomingTxIcon from './assets/incoming.svg'
import OutgoingTxIcon from './assets/outgoing.svg'
import SettingsTxIcon from './assets/settings.svg'

import { IconText, Loader } from '~/components-v2'
import { getAppInfoFromOrigin, getAppInfoFromUrl } from '~/routes/safe/components/Apps/utils'
import { type TransactionType } from '~/routes/safe/store/models/transaction'

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

const TxType = ({ origin, txType }: { txType: TransactionType, origin: string | null }) => {
  const isThirdPartyApp = txType === 'third-party-app'
  const [loading, setLoading] = useState(true)
  const [appInfo, setAppInfo] = useState()

  useEffect(() => {
    const getAppInfo = async () => {
      const parsedOrigin = getAppInfoFromOrigin(origin)
      const appInfo = await getAppInfoFromUrl(parsedOrigin.url)
      setAppInfo(appInfo)
      setLoading(false)
    }

    if (!isThirdPartyApp) {
      return
    }

    getAppInfo()
  }, [txType])

  if (!isThirdPartyApp) {
    return <IconText iconUrl={typeToIcon[txType]} text={typeToLabel[txType]} />
  }

  return loading ? <Loader centered={false} size={20} /> : <IconText iconUrl={appInfo.iconUrl} text={appInfo.name} />
}
export default TxType
