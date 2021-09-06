import React, { useEffect } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const APPS_STORAGE_MIGRATION_DONE = 'APPS_STORAGE_MIGRATION_DONE'

type MigrationMessage = {
  migrate: boolean
  payload: string
}

type MigratedMessage = {
  migrated: boolean
}

const MigrationScreen: React.FC = () => {
  useEffect(() => {
    const loadStorageMigrationDone = async () => {
      const storageMigrationDone = await loadFromStorage(APPS_STORAGE_MIGRATION_DONE)
      if (storageMigrationDone) {
        const message: MigratedMessage = {
          migrated: true,
        }
        window.parent.postMessage(message, parent.origin)
      }
    }

    loadStorageMigrationDone()
  }, [])

  useEffect(() => {
    const saveEventData = (event) => {
      if (event.data.migrated && event.origin === parent.origin) {
        saveToStorage(APPS_STORAGE_MIGRATION_DONE, true)
      }
    }
    window.addEventListener('message', saveEventData, false)
    return window.removeEventListener('message', saveEventData, false)
  }, [])

  // Once the app loads completely we ping the parent to start the migration
  useEffect(() => {
    const message: MigrationMessage = {
      migrate: true,
      payload: JSON.stringify(localStorage),
    }
    window.parent.postMessage(message, parent.origin)
  }, [])
  return <div>Migrator</div>
}

export default MigrationScreen
