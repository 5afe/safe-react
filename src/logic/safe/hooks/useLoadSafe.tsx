import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import fetchLatestMasterContractVersion from 'src/logic/safe/store/actions/fetchLatestMasterContractVersion'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { updateAvailableCurrencies } from 'src/logic/currencyValues/store/actions/updateAvailableCurrencies'
import { fetchSelectedCurrency } from 'src/logic/currencyValues/store/actions/fetchSelectedCurrency'

export const useLoadSafe = (safeAddress?: string): boolean => {
  const dispatch = useDispatch<Dispatch>()
  const [isSafeLoaded, setIsSafeLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsSafeLoaded(false)
      if (safeAddress) {
        await dispatch(fetchSelectedCurrency())
        await dispatch(fetchLatestMasterContractVersion())
        await dispatch(fetchSafe(safeAddress, isSafeLoaded))
        setIsSafeLoaded(true)
        await dispatch(updateAvailableCurrencies())
        await dispatch(fetchTransactions(safeAddress))
        dispatch(addViewedSafe(safeAddress))
      }
    }
    fetchData()
  }, [dispatch, safeAddress])

  return isSafeLoaded
}
