import { ReactElement, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addressBookMigrate } from 'src/logic/addressBook/store/actions'
import { saveMigratedKeyToStorage } from 'src/utils/storage'
import { isNetworkSubdomain, getNetworksToMigrate, handleMessage, getSubdomainUrl, NETWORK_TO_MIGRATE } from './utils'

const IFRAME_PATH = '/migrate-local-storage.html'

const StoreMigrator = (): ReactElement => {
  const dispatch = useDispatch()
  const [networksToMigrate, setNetworksToMigrate] = useState<NETWORK_TO_MIGRATE[]>([])

  useEffect(() => {
    if (isNetworkSubdomain()) {
      return
    }
    const remainingNetworks = getNetworksToMigrate()
    setNetworksToMigrate(remainingNetworks)
  }, [])

  // Add an event listener to receive the data to be migrated and save it into the storage
  useEffect(() => {
    if (!networksToMigrate.length) {
      return
    }

    const onMessage = (event: MessageEvent) => {
      handleMessage(
        event,
        // Save address book
        (addressBookData) => dispatch(addressBookMigrate(addressBookData)),
        // Save immortal data
        (key, value) => saveMigratedKeyToStorage(key, value),
        // When done, clean up the iframes
        () => setNetworksToMigrate([]),
      )
    }

    window.addEventListener('message', onMessage, false)

    return () => window.removeEventListener('message', onMessage, false)
  }, [dispatch, networksToMigrate, setNetworksToMigrate])

  return (
    <>
      {networksToMigrate.map((network) => (
        <iframe key={network} width="0" height="0" hidden src={`${getSubdomainUrl(network)}${IFRAME_PATH}`} />
      ))}
    </>
  )
}

export default StoreMigrator
