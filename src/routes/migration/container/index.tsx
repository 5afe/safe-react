import React, { useEffect } from 'react'

export type MigrationMessage = {
  migrate: boolean
  payload: string
}

const MigrationScreen: React.FC = () => {
  useEffect(() => {
    const loadStorageMigrationDone = async () => {
      const payload = {}
      Object.keys(localStorage).forEach((key) => {
        payload[key] = JSON.stringify(localStorage[key])
      })
      const message: MigrationMessage = {
        migrate: true,
        payload: JSON.stringify(payload),
      }
      window.parent.postMessage(message, '*')
    }

    loadStorageMigrationDone()
  }, [])
  return null
}

export default MigrationScreen
