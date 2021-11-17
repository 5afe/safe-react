import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { sortedSafeListSelector } from 'src/components/SafeListSidebar/selectors'
import { currentNetworks } from 'src/logic/config/store/selectors'
import { ETHEREUM_NETWORK } from 'src/types/network'
import { SafeRecordProps } from '../store/models/safe'

import { getLocalNetworkSafesById } from '../utils'

type LocalSafes = Record<ETHEREUM_NETWORK, SafeRecordProps[]>

const useLocalSafes = (): LocalSafes => {
  const networks = useSelector(currentNetworks)

  const getEmptyLocalSafes = () => networks.reduce((safes, { chainId }) => ({ ...safes, [chainId]: [] }), {})

  const [localSafes, setLocalSafes] = useState<LocalSafes>(() => getEmptyLocalSafes())
  const addedSafes = useSelector(sortedSafeListSelector)
  const addedAddresses = addedSafes.map(({ address }) => address).join()

  // Reload added Safes from the localStorage when addedAddresses changes
  useEffect(() => {
    const getLocalSafes = () => {
      networks.forEach(async ({ chainId }) => {
        const localSafe = await getLocalNetworkSafesById(chainId)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          ...(localSafe && { [chainId]: localSafe }),
        }))
      })
    }

    getLocalSafes()
  }, [networks, addedAddresses])

  return localSafes
}

export default useLocalSafes
