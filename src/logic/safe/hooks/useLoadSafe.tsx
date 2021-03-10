import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import loadAddressBookFromStorage from 'src/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import fetchLatestMasterContractVersion from 'src/logic/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import fetchSafeCreationTx from 'src/logic/safe/store/actions/fetchSafeCreationTx'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { updateAvailableCurrencies } from 'src/logic/currencyValues/store/actions/updateAvailableCurrencies'

export const useLoadSafe = (safeAddress?: string): boolean => {
  const dispatch = useDispatch<Dispatch>()
  const [isSafeLoaded, setIsSafeLoaded] = useState(false)
  const currentCurrency = useSelector(currentCurrencySelector)

  useEffect(() => {
    const fetchData = async () => {
      if (safeAddress) {
        await dispatch(fetchLatestMasterContractVersion())
        await dispatch(fetchSafe(safeAddress))
        setIsSafeLoaded(true)
        await dispatch(fetchSafeTokens(safeAddress, currentCurrency))
        dispatch(updateAvailableCurrencies())
        dispatch(fetchSafeCreationTx(safeAddress))
        dispatch(fetchTransactions(safeAddress))
        dispatch(addViewedSafe(safeAddress))
      }
    }
    dispatch(loadAddressBookFromStorage())

    fetchData()
  }, [dispatch, safeAddress, currentCurrency])

  return isSafeLoaded
}
