// @flow
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Page from '~/components/layout/Page'
import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import { type Token } from '~/logic/tokens/store/model/token'
import Layout from '~/routes/safe/components/Layout'
import { useCheckForUpdates } from '~/routes/safe/container/Hooks/useCheckForUpdates'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

type Action = 'Send' | 'Receive'

const INITIAL_STATE = {
  sendFunds: {
    isOpen: false,
    selectedToken: undefined,
  },
  showReceive: false,
}

const SafeView = () => {
  const [state, setState] = useState(INITIAL_STATE)
  const [safeLoaded, setSafeLoaded] = useState(false)
  const dispatch = useDispatch()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  useEffect(() => {
    const fetchData = () => {
      if (safeAddress) {
        dispatch(fetchLatestMasterContractVersion())
          .then(() => dispatch(fetchSafe(safeAddress)))
          .then(() => {
            setSafeLoaded(true)
            dispatch(loadAddressBookFromStorage())
            return dispatch(fetchTransactions(safeAddress))
          })
          .then(() => dispatch(addViewedSafe(safeAddress)))
      }
    }
    fetchData()
  }, [safeAddress])

  useCheckForUpdates()

  const onShow = (action: Action) => () => {
    setState({
      ...state,
      [`show${action}`]: true,
    })
  }

  const onHide = (action: Action) => () => {
    setState({
      ...state,
      [`show${action}`]: false,
    })
  }

  const showSendFunds = (token: Token) => {
    setState({
      ...state,
      sendFunds: {
        isOpen: true,
        selectedToken: token,
      },
    })
  }

  const hideSendFunds = () => {
    setState({
      ...state,
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
    })
  }
  const { sendFunds, showReceive } = state

  return (
    <Page>
      {!safeLoaded ? null : (
        <>
          <Layout
            hideSendFunds={hideSendFunds}
            onHide={onHide}
            onShow={onShow}
            sendFunds={sendFunds}
            showReceive={showReceive}
            showSendFunds={showSendFunds}
          />
        </>
      )}
    </Page>
  )
}

export default SafeView
