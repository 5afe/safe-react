import { useEffect, useState } from 'react'

import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { SafeRecordProps } from '../store/models/safe'
import { getLocalNetworkSafesById } from '../utils'

type EmptyLocalSafes = Record<ETHEREUM_NETWORK, never[]>
type LocalSafes = Record<ETHEREUM_NETWORK, SafeRecordProps[] | never[]>

const getEmptyLocalSafes = (): EmptyLocalSafes => {
  const networkIds = Object.values(ETHEREUM_NETWORK)
  return networkIds.reduce((safes, networkId) => ({ ...safes, [networkId]: [] }), {} as EmptyLocalSafes)
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
