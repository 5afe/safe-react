import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AddressBookEntry, makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookAddOrUpdate } from 'src/logic/addressBook/store/actions'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { MIGRATION_ADDRESS } from 'src/routes/routes'

const MAINET_URL = 'https://pr2695--safereact.review.gnosisdev.com/mainnet/'
const networks = [
  {
    safeUrl: 'https://pr2695--safereact.review.gnosisdev.com/rinkeby/',
  },
  {
    safeUrl: 'https://pr2695--safereact.review.gnosisdev.com/polygon/',
  },
]

type MigratedMessage = {
  migrated: boolean
}

const mergeAddressBooks = (addressBookEntries: AddressBookEntry[], dispatch) => {
  addressBookEntries.forEach((addressBookEntry) => {
    // Save addressBookEntries
    dispatch(addressBookAddOrUpdate(makeAddressBookEntry(addressBookEntry)))
  })
}

const StoreMigrator: React.FC = () => {
  const [currentNetwork, setCurrentNetwork] = useState(0)
  const dispatch = useDispatch()
  //let networks = getNetworks()

  // Recieve the data to be migrated and save it into the localstorage
  useEffect(() => {
    const saveEventData = (event) => {
      const isTrustedOrigin = networks.some((network) => {
        return network.safeUrl.includes(event.origin)
      })
      const isRightOrigin = event.origin !== self.origin && isTrustedOrigin
      if (event.data.migrate && isRightOrigin) {
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
          const migrationIframe = (document.getElementById('targetWindow') as HTMLIFrameElement).contentWindow
          if (migrationIframe) {
            const message: MigratedMessage = {
              migrated: true,
            }
            migrationIframe.postMessage(message, networks[currentNetwork].safeUrl)
          }
          setCurrentNetwork(currentNetwork + 1)
        } catch (error) {
          logError(Errors._612, error.message)
        }
      }
      if (event.data.migrated && isRightOrigin) {
        setCurrentNetwork(currentNetwork + 1)
      }
    }

    window.addEventListener('message', saveEventData, false)
    return window.removeEventListener('message', saveEventData, false)
  }, [currentNetwork, dispatch])

  const isSingleNetworkApp = networks.some((network) => {
    return self.origin !== MAINET_URL && network.safeUrl.includes(self.origin)
  })
  // Migrate local storage
  useEffect(() => {
    if (!isSingleNetworkApp && currentNetwork < networks.length) {
      const urlToMigrate = `${networks[currentNetwork].safeUrl}${MIGRATION_ADDRESS}`
      window.open(urlToMigrate, 'targetWindow')
    }
  }, [currentNetwork, isSingleNetworkApp])

  return (
    <div>{!isSingleNetworkApp && <iframe width="0px" height="0px" name="targetWindow" id="targetWindow"></iframe>}</div>
  )
}

export default StoreMigrator
