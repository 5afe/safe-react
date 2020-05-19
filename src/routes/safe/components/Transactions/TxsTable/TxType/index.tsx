import { IconText, Loader } from '@gnosis.pm/safe-react-components'
import React, { useEffect, useState } from 'react'

import CustomTxIcon from './assets/custom.svg'
import IncomingTxIcon from './assets/incoming.svg'
import OutgoingTxIcon from './assets/outgoing.svg'
import SettingsTxIcon from './assets/settings.svg'

import CustomIconText from '~/components/CustomIconText'
import { getAppInfoFromOrigin, getAppInfoFromUrl } from '~/routes/safe/components/Apps/utils'

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
  custom: 'Contract Interaction',
  settings: 'Modify settings',
  creation: 'Safe created',
  cancellation: 'Cancellation transaction',
  upgrade: 'Contract Upgrade',
}

const TxType = ({ origin, txType }) => {
  const [loading, setLoading] = useState(true)
  const [appInfo, setAppInfo] = useState()
  const [forceCustom, setForceCustom] = useState(false)

  useEffect(() => {
    const getAppInfo = async () => {
      const parsedOrigin = getAppInfoFromOrigin(origin)
      if (!parsedOrigin) {
        setForceCustom(true)
        setLoading(false)
        return
      }
      const appInfo = await getAppInfoFromUrl(parsedOrigin.url)
      setAppInfo(appInfo)
      setLoading(false)
    }

    if (!origin) {
      return
    }

    getAppInfo()
  }, [origin, txType])

  if (forceCustom || !origin) {
    return <CustomIconText iconUrl={typeToIcon[txType]} text={typeToLabel[txType]} />
  }

  return loading ? <Loader size="md" /> : <IconText iconUrl={appInfo.iconUrl} text={appInfo.name} />
}
export default TxType
