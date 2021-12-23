import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { saveMigratedKeyToStorage } from 'src/utils/storage'
import {
  NETWORK_TO_MIGRATE,
  isNetworkSubdomain,
  getNetworksToMigrate,
  handleMessage,
  getSubdomainUrl,
  addMigratedNetwork,
} from './utils'

const IFRAME_PATH = '/migrate-local-storage.html'
const MAX_WAIT = 10e3 // 10 seconds

const getIframeUrl = (network: NETWORK_TO_MIGRATE): string => `${getSubdomainUrl(network)}${IFRAME_PATH}`

const StoreMigrator = (): ReactElement | null => {
  const dispatch = useDispatch()
  const [networksToMigrate, setNetworksToMigrate] = useState<NETWORK_TO_MIGRATE[]>([])
  const [networkIndex, setNetworkIndex] = useState<number>(0)
  const currentNetwork = networksToMigrate[networkIndex]

  useEffect(() => {
    if (isNetworkSubdomain()) return
    const remainingNetworks = getNetworksToMigrate()
    setNetworksToMigrate(remainingNetworks)
  }, [])

  // Fix broken keys that start with v2_
  useEffect(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('v2_')) {
          const val = localStorage.getItem(key)
          localStorage.removeItem(key)
          if (val) {
            localStorage.setItem(`_immortal|${key}`, val)
          }
        }
      })
    } catch (err) {
      // ignore
    }
  }, [])

  // Add an event listener to receive the data to be migrated and save it into the storage
  useEffect(() => {
    if (!currentNetwork) return

    const nextNetwork = () => setNetworkIndex((index) => index + 1)

    const timeout = setTimeout(nextNetwork, MAX_WAIT)

    const onMessage = (event: MessageEvent) => {
      handleMessage(
        event,
        // Move to the next network
        () => {
          clearTimeout(timeout)
          addMigratedNetwork(currentNetwork)
          nextNetwork()
        },
        // Save address book
        (addressBookData) => dispatch(addressBookMigrate(addressBookData)),
        // Save immortal data
        (key, value) => saveMigratedKeyToStorage(key, value),
      )
    }

    window.addEventListener('message', onMessage, false)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('message', onMessage, false)
    }
  }, [dispatch, currentNetwork, setNetworkIndex])

  return currentNetwork ? (
    <iframe key={currentNetwork} width="0" height="0" hidden src={getIframeUrl(currentNetwork)} />
  ) : null
}

export default StoreMigrator
