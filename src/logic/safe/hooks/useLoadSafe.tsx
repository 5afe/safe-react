import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import addViewedSafe from 'src/logic/currentSession/store/actions/addViewedSafe'
import fetchLatestMasterContractVersion from 'src/logic/safe/store/actions/fetchLatestMasterContractVersion'
import { fetchSafe } from 'src/logic/safe/store/actions/fetchSafe'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { updateAvailableCurrencies } from 'src/logic/currencyValues/store/actions/updateAvailableCurrencies'
import { currentChainId } from 'src/logic/config/store/selectors'

export const useLoadSafe = (safeAddress?: string): boolean => {
  const dispatch = useDispatch<Dispatch>()
  const chainId = useSelector(currentChainId)
  const [isSafeLoaded, setIsSafeLoaded] = useState(false)

  useEffect(() => {
    setIsSafeLoaded(false)
  }, [safeAddress])

  useEffect(() => {
    const fetchData = async () => {
      if (safeAddress) {
        await dispatch(fetchLatestMasterContractVersion())
        await dispatch(fetchSafe(safeAddress, isSafeLoaded))
        setIsSafeLoaded(true)
        await dispatch(updateAvailableCurrencies())
        await dispatch(fetchTransactions(chainId, safeAddress))
        dispatch(addViewedSafe(safeAddress))
      }
    }
    fetchData()
  }, [chainId, dispatch, safeAddress, isSafeLoaded])

  return isSafeLoaded
}
