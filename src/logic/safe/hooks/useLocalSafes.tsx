import { useEffect, useState } from 'react'
import { getNetworks } from 'src/config'

import { ETHEREUM_NETWORK } from 'src/config/network.d'
import { SafeRecordProps } from '../store/models/safe'
import { getLocalNetworkSafesById } from '../utils'

type EmptyLocalSafes = Record<ETHEREUM_NETWORK, never[]>
type LocalSafes = Record<ETHEREUM_NETWORK, SafeRecordProps[] | never[]>

const getEmptyLocalSafes = (): EmptyLocalSafes =>
  getNetworks().reduce((safes, { chainId }) => ({ ...safes, [chainId]: [] }), {} as EmptyLocalSafes)

const useLocalSafes = (): LocalSafes => {
  const [localSafes, setLocalSafes] = useState<LocalSafes>(() => getEmptyLocalSafes())

  useEffect(() => {
    const getLocalSafes = () => {
      getNetworks().forEach(async ({ chainId }) => {
        const localSafe = await getLocalNetworkSafesById(chainId)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          ...(localSafe && { [chainId]: localSafe }),
        }))
      })
    }

    getLocalSafes()
  }, [])

  return localSafes
}

export default useLocalSafes
