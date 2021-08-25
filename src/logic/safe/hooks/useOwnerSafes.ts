import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { fetchSafesByOwner } from 'src/logic/safe/api/fetchSafesByOwner'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

const useOwnerSafes = (): string[] => {
  const connectedWalletAddress = useSelector(userAccountSelector)
  const [ownerSafes, setOwnerSafes] = useState<string[]>([])

  useEffect(() => {
    setOwnerSafes([])

    if (!connectedWalletAddress) {
      return
    }

    const load = async () => {
      try {
        const safes = await fetchSafesByOwner(connectedWalletAddress)
        setOwnerSafes(safes)
      } catch (err) {
        logError(Errors._610, err.message)
      }
    }
    load()
  }, [connectedWalletAddress])

  return ownerSafes
}

export default useOwnerSafes
