import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { fetchSafesByOwner } from 'src/logic/safe/api/fetchSafesByOwner'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { currentChainId } from 'src/logic/config/store/selectors'

const cache: Record<string, Record<string, string[]>> = {}

const useOwnerSafes = (): Record<string, string[]> => {
  const connectedWalletAddress = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)
  const [ownerSafes, setOwnerSafes] = useState<Record<string, string[]>>(cache[connectedWalletAddress] || {})

  useEffect(() => {
    if (!connectedWalletAddress) {
      return
    }

    const load = async () => {
      try {
        const safes = await fetchSafesByOwner(connectedWalletAddress)

        cache[connectedWalletAddress] = {
          ...(cache[connectedWalletAddress] || {}),
          [chainId]: safes,
        }

        setOwnerSafes(cache[connectedWalletAddress])
      } catch (err) {
        logError(Errors._610, err.message)
      }
    }

    load()
  }, [chainId, connectedWalletAddress, setOwnerSafes])

  return ownerSafes
}

export default useOwnerSafes
