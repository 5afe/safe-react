import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { currentNetworks } from 'src/logic/config/store/selectors'

import { ETHEREUM_NETWORK } from 'src/types/network.d'
import { SafeRecordProps } from '../store/models/safe'
import { getLocalNetworkSafesById } from '../utils'

type EmptyLocalSafes = Record<ETHEREUM_NETWORK, never[]>
type LocalSafes = Record<ETHEREUM_NETWORK, SafeRecordProps[] | never[]>

const useLocalSafes = (): LocalSafes => {
  const networks = useSelector(currentNetworks)

  const getEmptyLocalSafes = (): EmptyLocalSafes =>
    networks.reduce((safes, { chainId }) => ({ ...safes, [chainId]: [] }), {} as EmptyLocalSafes)

  const [localSafes, setLocalSafes] = useState<LocalSafes>(getEmptyLocalSafes)

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
  }, [networks])

  return localSafes
}

export default useLocalSafes
