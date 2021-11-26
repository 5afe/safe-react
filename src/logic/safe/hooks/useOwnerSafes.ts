import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { fetchSafesByOwner } from 'src/logic/safe/api/fetchSafesByOwner'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentChainId } from 'src/logic/config/store/selectors'
import useStoredState from 'src/utils/storage/useStoredState'

type OwnedSafesCache = Record<string, Record<string, string[]>>

const storageKey = 'ownedSafes'

const useOwnerSafes = (): Record<string, string[]> => {
  const connectedWalletAddress = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)
  const [cache = {}, setCache] = useStoredState<OwnedSafesCache>(storageKey)
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
