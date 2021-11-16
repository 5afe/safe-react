import { useEffect, useState } from 'react'

import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { SafeRecordWithNames } from '../store/selectors'
import { getLocalNetworkSafesById } from '../utils'

type LocalSafes = Record<ETHEREUM_NETWORK, SafeRecordWithNames[]>

const getEmptyLocalSafes = (): LocalSafes => {
  const networkIds = Object.values(ETHEREUM_NETWORK)
  return networkIds.reduce((safes, networkId) => ({ ...safes, [networkId]: [] }), {} as LocalSafes)
}

const useLocalSafes = (): LocalSafes => {
  const [localSafes, setLocalSafes] = useState<LocalSafes>(() => getEmptyLocalSafes())

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
