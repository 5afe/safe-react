import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// import loadAddressBookFromStorage from 'src/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import fetchLatestMasterContractVersion from 'src/logic/safe/store/actions/fetchLatestMasterContractVersion'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { updateAvailableCurrencies } from 'src/logic/currencyValues/store/actions/updateAvailableCurrencies'

export const useLoadSafe = (safeAddress?: string, loadedViaUrl = true): boolean => {
  const dispatch = useDispatch<Dispatch>()
  const [isSafeLoaded, setIsSafeLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (safeAddress) {
        await dispatch(fetchLatestMasterContractVersion())
        await dispatch(fetchSafe(safeAddress))
        setIsSafeLoaded(true)
        await dispatch(fetchSafeTokens(safeAddress))
        await dispatch(updateAvailableCurrencies())
        await dispatch(fetchTransactions(safeAddress))
        if (!loadedViaUrl) {
          dispatch(addViewedSafe(safeAddress))
        }
      }
    }

    // dispatch(loadAddressBookFromStorage())
    fetchData()
  }, [dispatch, safeAddress, loadedViaUrl])

  return isSafeLoaded
}
