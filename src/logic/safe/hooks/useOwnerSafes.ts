import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { safesAsList } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { fetchSafesByOwner } from 'src/logic/safe/api/fetchSafesByOwner'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { IS_PRODUCTION } from 'src/utils/constants'

const useOwnerSafes = (): string[] => {
  const connectedWalletAddress = useSelector(userAccountSelector)
  const savedSafes = useSelector(safesAsList)
  const [ownerSafes, setOwnerSafes] = useState<string[]>([])
  const [filteredSafes, setFilteredSafes] = useState<string[]>([])

  useEffect(() => {
    if (IS_PRODUCTION || !connectedWalletAddress) {
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

  useMemo(() => {
    const unsavedSafes = ownerSafes.filter((address) => !savedSafes.some((item) => sameAddress(address, item.address)))
    setFilteredSafes(unsavedSafes)
  }, [ownerSafes, savedSafes])

  return filteredSafes
}

export default useOwnerSafes
