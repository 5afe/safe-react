import React, { useEffect, useState } from 'react'
import { MIGRATION_ADDRESS } from 'src/routes/routes'
import { saveToStorage, loadFromStorage } from 'src/utils/storage'

const MIGRATION_PATH_BASE_URL = 'http://localhost:3001/#'
const MIGRATION_PATH = `${MIGRATION_PATH_BASE_URL}${MIGRATION_ADDRESS}`
const APPS_STORAGE_MIGRATION_DONE = 'APPS_STORAGE_MIGRATION_DONE'

const StoreMigrator: React.FC = () => {
  const [migrationDone, setMigrationDone] = useState(false)
  const [checkMigrationDone, setCheckMigrationDone] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Redirect if migration already happened
  useEffect(() => {
    const loadStorageMigrationDone = async () => {
      const storageMigrationDone = await loadFromStorage(APPS_STORAGE_MIGRATION_DONE)
      if (storageMigrationDone) {
        window.location.href = MIGRATION_PATH_BASE_URL
        setCheckMigrationDone(true)
      }
    }

    loadStorageMigrationDone()
  }, [])

  // Migrate local storage
  useEffect(() => {
    const migrateLocalStorage = (event) => {
      if (event.data.migrateReady) {
        const iframeWindow = (document.getElementById('targetWindow') as any).contentWindow
        if (iframeWindow) {
          iframeWindow.postMessage(
            {
              migrate: true,
              payload: JSON.stringify(localStorage),
            },
            MIGRATION_PATH_BASE_URL, // TODO Replace with target origin
          )
        }
      }
      if (event.data.migrateDone) {
        saveToStorage(APPS_STORAGE_MIGRATION_DONE, true)
        setMigrationDone(true)
      }
    }

    window.addEventListener('message', migrateLocalStorage, false)

    return window.removeEventListener('message', migrateLocalStorage)
  }, [])

  // Load migration target
  useEffect(() => {
    if (!loaded && checkMigrationDone && !MIGRATION_PATH_BASE_URL.includes(self.origin)) {
      const w = window.open(MIGRATION_PATH, 'targetWindow')
      if (w) {
        setLoaded(true)
      }
    }
  }, [loaded, checkMigrationDone])
  return (
    <div>
      {!migrationDone && !MIGRATION_PATH_BASE_URL.includes(self.origin) && (
        <iframe width="0px" height="0px" name="targetWindow" id="targetWindow"></iframe>
      )}
    </div>
  )
}

export default StoreMigrator
