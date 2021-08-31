import React, { useState } from 'react'

const StoreMigrator: React.FC = () => {
  const [migrationDone, setMigrationDone] = useState(false)
  window.addEventListener(
    'message',
    (event) => {
      if (event.data.migrate) {
        // Update localstorage
        window.parent.postMessage(
          {
            migrateDone: true,
          },
          '*',
        )
      }
      if (event.data.migrateDone) {
        // TODO Turn migration done flag on
        setMigrationDone(true)
      }
    },
    false,
  )

  const loadFrame = () => {
    window.open('http://localhost:3000', 'targetWindow')
  }

  const migrateStore = () => {
    const iframeWindow = (document.getElementById('targetWindow') as any).contentWindow
    if (iframeWindow) {
      iframeWindow.postMessage(
        {
          migrate: true,
          storage: JSON.stringify(localStorage),
        },
        '*',
      )
    }
  }

  return (
    <div>
      {!migrationDone && (
        <div>
          <button onClick={loadFrame}>Load Iframe</button>
          <button onClick={migrateStore}>Migrate</button>
          <iframe name="targetWindow" id="targetWindow"></iframe>
        </div>
      )}
    </div>
  )
}

export default StoreMigrator
