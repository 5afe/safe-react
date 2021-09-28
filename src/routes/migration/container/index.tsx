import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { isLocalStorageMigrated } from 'src/logic/currentSession/store/selectors'
import setLocalStorageMigrated from 'src/logic/currentSession/store/actions/setLocalStorageMigrated'
import { MAINET_URL } from 'src/components/StoreMigrator'

export type MigrationMessage = {
  executeMigration: boolean
  payload: string
}

// FIXME Review to set to the correct mainnet URL on Prod/Staging
const MESSAGE_TARGET_ORIGIN = MAINET_URL

const MigrationScreen = (): ReactElement => {
  const dispatch = useDispatch()
  const [messageSent, setMessageSent] = useState(false)
  const alreadyMigrated = useSelector(isLocalStorageMigrated)

  useEffect(() => {
    const sendStorageInformation = async () => {
      const payload = {}
      Object.keys(localStorage).forEach((key) => {
        // We only migrate the addres book and safe information related keys
        // We avoid moving any related session information that could be sensible (WalletConnect...)
        if (key === 'SAFE__addressBook' || key.startsWith('_immortal|v2_')) {
          payload[key] = localStorage[key]
        }
      })
      const message: MigrationMessage = {
        executeMigration: true,
        payload: JSON.stringify(payload),
      }
      window.parent.postMessage(message, MESSAGE_TARGET_ORIGIN)
      // window.parent.postMessage(message, 'https://pr2695--safereact.review.gnosisdev.com')
      setMessageSent(true)
      dispatch(setLocalStorageMigrated(true))
    }

    const skipMigration = () => {
      const message: MigrationMessage = {
        executeMigration: false,
        payload: '',
      }
      window.parent.postMessage(message, MESSAGE_TARGET_ORIGIN)
      setMessageSent(true)
    }

    // Ensure that we send only one message on each render as useEffect is triggered again after
    // alreadyMigrated is updated
    if (!messageSent) {
      if (alreadyMigrated) {
        skipMigration()
      } else {
        sendStorageInformation()
      }
    }
  }, [alreadyMigrated, dispatch, messageSent])

  return <></>
}

export default MigrationScreen
