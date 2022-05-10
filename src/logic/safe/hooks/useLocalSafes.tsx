import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { sortedSafeListSelector } from 'src/components/SafeListSidebar/selectors'
import { getChains } from 'src/config/cache/chains'
import { ChainId } from 'src/config/chain.d'
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
      getChains().forEach(({ chainId }) => {
        const localSafe = getLocalNetworkSafesById(chainId)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          ...(localSafe && { [chainId]: localSafe }),
        }))
      })
    }

    getLocalSafes()
  }, [addedAddresses])

  return localSafes
}

export default useLocalSafes
