import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { sortedSafeListSelector } from 'src/components/SafeListSidebar/selectors'
import { getChains } from 'src/config/cache/chains'
import { ChainId } from 'src/config/chain.d'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import { trackEventMemoized } from 'src/utils/googleTagManager'
import { SafeRecordProps } from '../store/models/safe'
import { getLocalNetworkSafesById } from '../utils'

export type LocalSafes = Record<ChainId, SafeRecordProps[]>

const getEmptyLocalSafes = (): LocalSafes => {
  return getChains().reduce((safes, { chainId }) => ({ ...safes, [chainId]: [] }), {} as LocalSafes)
}

const useLocalSafes = (): LocalSafes => {
  const [localSafes, setLocalSafes] = useState<LocalSafes>(() => getEmptyLocalSafes())
  const addedSafes = useSelector(sortedSafeListSelector)
  const addedAddresses = addedSafes.map(({ address }) => address).join()

  // Reload added Safes from the localStorage when addedAddresses changes
  useEffect(() => {
    const getLocalSafes = () => {
      getChains().forEach(({ chainId, chainName }) => {
        const localSafe = getLocalNetworkSafesById(chainId)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          ...(localSafe && { [chainId]: localSafe }),
        }))

        if (localSafe && localSafe.length > 0) {
          const event = OVERVIEW_EVENTS.ADDED_SAFES_ON_NETWORK
          trackEventMemoized(
            {
              ...event,
              action: `${event.action} ${chainName}`,
              label: localSafe.length,
            },
            chainId,
          )
        }
      })
    }

    getLocalSafes()
  }, [addedAddresses])

  return localSafes
}

export default useLocalSafes
