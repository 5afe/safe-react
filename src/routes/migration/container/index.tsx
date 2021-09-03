import React, { useEffect } from 'react'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookAddOrUpdate } from 'src/logic/addressBook/store/actions'
import { useDispatch } from 'react-redux'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
// import { getNetworks } from 'src/config'

const mergeAddressBooks = (addressBookEntries: AddressBookEntry[], dispatch) => {
  addressBookEntries.forEach((addressBookEntry) => {
    // Save addressBookEntries
    dispatch(addressBookAddOrUpdate(makeAddressBookEntry(addressBookEntry)))
  })
}

const MigrationScreen: React.FC = () => {
  const dispatch = useDispatch()

  // Recieve the data to be migrated and save it into the localstorage
  useEffect(() => {
    const saveEventData = (event) => {
      // Uncomment once we send it to prod
      /*const networks = getNetworks()
        const isTrustedOrigin = networks.some((network) => {
          return network.safeUrl.includes(event.origin)
        })
        */
      // Also add isTrustedOrigin to the if clause
      if (event.data.migrate && event.origin !== self.origin) {
        try {
          const payload = JSON.parse(event.data.payload)
          Object.keys(payload).forEach((key) => {
            const payloadEntry = JSON.parse(payload[key])
            if (key === 'SAFE__addressBook') {
              mergeAddressBooks(payloadEntry, dispatch)
            } else if (key.startsWith('_immortal|v2_')) {
              // Save entry in localStorage
              localStorage.setItem(key, payloadEntry)
            }
          })
          // Commented until we expose the unified app
          /*window.parent.postMessage(
            {
              migrateDone: true,
            },
            event.origin,
          )*/
        } catch (error) {
          logError(Errors._612, error.message)
        }
      }
    }

    window.addEventListener('message', saveEventData, false)
    return window.removeEventListener('message', saveEventData, false)
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
