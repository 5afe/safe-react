import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'
import { fetchSafesByOwner } from 'src/logic/safe/api/fetchSafesByOwner'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentChainId } from 'src/logic/config/store/selectors'
import useCachedState from 'src/utils/storage/useCachedState'

type OwnedSafesCache = Record<string, Record<string, string[]>>

const storageKey = 'ownedSafes'

const useOwnerSafes = (): Record<string, string[]> => {
  const { account } = useOnboard()
  const connectedWalletAddress = account.address
  const chainId = useSelector(currentChainId)
  const [cache = {}, setCache] = useCachedState<OwnedSafesCache>(storageKey)
  const ownerSafes = cache[connectedWalletAddress] || {}

  useEffect(() => {
    if (!connectedWalletAddress) {
      return
    }

    const load = async () => {
      try {
        const safes = await fetchSafesByOwner(connectedWalletAddress)

        setCache((prev = {}) => ({
          ...prev,
          [connectedWalletAddress]: {
            ...(prev[connectedWalletAddress] || {}),
            [chainId]: safes,
          },
        }))
      } catch (err) {
        logError(Errors._610, err.message)
      }
    }

    load()
  }, [chainId, connectedWalletAddress, setCache])

  return ownerSafes
}

export default useOwnerSafes
