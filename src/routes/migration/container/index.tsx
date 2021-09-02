import React, { useEffect } from 'react'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookAddOrUpdate } from 'src/logic/addressBook/store/actions'
import { useDispatch } from 'react-redux'
// import { getNetworks } from 'src/config'

const MigrationScreen: React.FC = () => {
  const dispatch = useDispatch()

  // Recieve the data to be migrated and save it into the localstorage
  useEffect(() => {
    window.addEventListener(
      'message',
      (event) => {
        // Uncomment once we send it to prod
        /*const networks = getNetworks()
        const isTrustedOrigin = networks.some((network) => {
          return network.safeUrl.includes(event.origin)
        })
        */
        // Also add isTrustedOrigin to the if clause
        if (event.data.migrate && event.origin !== self.origin) {
          const payload = JSON.parse(event.data.payload)
          Object.keys(payload).forEach((key) => {
            const payloadEntry = JSON.parse(payload[key])
            if (key === 'SAFE__addressBook') {
              payloadEntry.forEach((addressBookEntry) => {
                // Save addressBookEntries
                dispatch(addressBookAddOrUpdate(makeAddressBookEntry(addressBookEntry)))
              })
            } else if (key !== 'intercom.intercom-state') {
              // Save entry in localStorage
              localStorage.setItem(key, payloadEntry)
            }
          })
          window.parent.postMessage(
            {
              migrateDone: true,
            },
            event.origin,
          )
        }
      },
      false,
    )
  }, [dispatch])

  // Once the app loads completely we ping the parent to start the migration
  useEffect(() => {
    window.parent.postMessage(
      {
        migrateReady: true,
      },
      '*',
    )
  }, [])
  return <div>Migrator</div>
}

export default MigrationScreen
