import { useEffect, useState } from 'react'

import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { SafeRecordProps } from '../store/models/safe'
import { getLocalNetworkSafesById } from '../utils'

type LocalSafes = Record<ETHEREUM_NETWORK, SafeRecordProps[] | never[]>

const useLocalSafes = (): LocalSafes => {
  const [localSafes, setLocalSafes] = useState<LocalSafes>(
    Object.values(ETHEREUM_NETWORK).reduce(
      (safes, networkId) => ({ ...safes, [networkId]: [] }),
      {} as Record<ETHEREUM_NETWORK, never[]>,
    ),
  )

  useEffect(() => {
    const getLocalSafes = () => {
      Object.values(ETHEREUM_NETWORK).forEach(async (id) => {
        const localSafe = await getLocalNetworkSafesById(id)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          ...(localSafe && { [id]: localSafe }),
        }))
      })
    }

    getLocalSafes()
  }, [])

  return localSafes
}

export default useLocalSafes
