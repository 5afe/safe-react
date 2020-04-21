// @flow
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import Page from '~/components/layout/Page'
import { type Token } from '~/logic/tokens/store/model/token'
import Layout from '~/routes/safe/components/Layout'
import { useCheckForUpdates } from '~/routes/safe/container/Hooks/useCheckForUpdates'
import { useLoadStore } from '~/routes/safe/container/Hooks/useLoadStore'
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
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  useLoadStore({ setSafeLoaded, safeAddress })
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
