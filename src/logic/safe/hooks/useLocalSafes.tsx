import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { sortedSafeListSelector } from 'src/components/SafeListSidebar/selectors'
import { ChainId, CHAIN_ID } from 'src/config'
import { SafeRecordProps } from '../store/models/safe'
import { getLocalNetworkSafesById } from '../utils'

type LocalSafes = Record<ChainId, SafeRecordProps[]>

const getEmptyLocalSafes = (): LocalSafes => {
  const networkIds = Object.values(CHAIN_ID)
  return networkIds.reduce((safes, chainId) => ({ ...safes, [chainId]: [] }), {} as LocalSafes)
}

const useLocalSafes = (): LocalSafes => {
  const [localSafes, setLocalSafes] = useState<LocalSafes>(() => getEmptyLocalSafes())
  const addedSafes = useSelector(sortedSafeListSelector)
  const addedAddresses = addedSafes.map(({ address }) => address).join()

  // Reload added Safes from the localStorage when addedAddresses changes
  useEffect(() => {
    const getLocalSafes = () => {
      Object.values(CHAIN_ID).forEach(async (id) => {
        const localSafe = await getLocalNetworkSafesById(id)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          ...(localSafe && { [id]: localSafe }),
        }))
      })
    }

    getLocalSafes()
  }, [addedAddresses])

  return localSafes
}

export default useLocalSafes
