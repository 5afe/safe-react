import { ReactElement, useEffect } from 'react'

export type MigrationMessage = {
  migrate: boolean
  payload: string
}

const MigrationScreen = (): ReactElement => {
  useEffect(() => {
    const loadStorageMigrationDone = async () => {
      const payload = {}
      console.log('This is migration screen localStorage', localStorage)
      Object.keys(localStorage).forEach((key) => {
        payload[key] = JSON.stringify(localStorage[key])
      })
      const message: MigrationMessage = {
        migrate: true,
        payload: JSON.stringify(payload),
      }
      console.log('This is the parent', window.parent)
      console.log('This is the origin', window.origin)
      window.parent.postMessage(message, '*')
      // window.parent.postMessage(message, 'https://pr2695--safereact.review.gnosisdev.com')
    }

    loadStorageMigrationDone()
  }, [])

  return <></>
}

export default MigrationScreen
