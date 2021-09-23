import { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { isLocalStorageMigrated } from 'src/logic/currentSession/store/selectors'
import setLocalStorageMigrated from 'src/logic/currentSession/store/actions/setLocalStorageMigrated'

export type MigrationMessage = {
  executeMigration: boolean
  payload: string
}

const MigrationScreen = (): ReactElement => {
  const dispatch = useDispatch()
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
      console.log('This is the parent', window.parent)
      console.log('This is the window origin', window.origin)
      window.parent.postMessage(message, '*')
      dispatch(setLocalStorageMigrated(true))
      // window.parent.postMessage(message, 'https://pr2695--safereact.review.gnosisdev.com')
    }

    const skipMigration = () => {
      const message: MigrationMessage = {
        executeMigration: false,
        payload: '',
      }
      window.parent.postMessage(message, '*')
    }

    console.log('Is already migrated?', alreadyMigrated)
    if (alreadyMigrated) {
      skipMigration()
    } else {
      sendStorageInformation()
    }
  }, [alreadyMigrated, dispatch])

  return <></>
}

export default MigrationScreen
