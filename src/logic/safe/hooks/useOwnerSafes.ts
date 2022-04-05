import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { fetchSafesByOwner } from 'src/logic/safe/api/fetchSafesByOwner'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentChainId } from 'src/logic/config/store/selectors'
import useCachedState from 'src/utils/storage/useCachedState'

type OwnedSafesCache = Record<string, Record<string, string[]>>

type UseOwnerSafesType = {
  hasLoaded: boolean
  ownerSafes: Record<string, string[]>
}

const storageKey = 'ownedSafes'

const useOwnerSafes = (): UseOwnerSafesType => {
  const connectedWalletAddress = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)
  const [cache = {}, setCache] = useCachedState<OwnedSafesCache>(storageKey)
  const ownerSafes = cache[connectedWalletAddress] || {}
  const [hasLoaded, setHasLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (!connectedWalletAddress) {
      return
    }
    let isCurrent = true

    const load = async () => {
      try {
        const safes = await fetchSafesByOwner(connectedWalletAddress)
        if (isCurrent) {
          setCache((prev = {}) => ({
            ...prev,
            [connectedWalletAddress]: {
              ...(prev[connectedWalletAddress] || {}),
              [chainId]: safes,
            },
          }))
        }
      } catch (err) {
        logError(Errors._610, err.message)
      }
      setHasLoaded(true)
    }
    load()

    return () => {
      isCurrent = false
    }
  }, [chainId, connectedWalletAddress, setCache])

  return { hasLoaded, ownerSafes }
}

export default useOwnerSafes
