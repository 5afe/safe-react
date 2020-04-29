// @flow
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import Page from '~/components/layout/Page'
import { type Token } from '~/logic/tokens/store/model/token'
import Layout from '~/routes/safe/components/Layout'
import { useCheckForUpdates } from '~/routes/safe/container/hooks/useCheckForUpdates'
import { useLoadSafe } from '~/routes/safe/container/hooks/useLoadSafe'
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
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  useLoadSafe(safeAddress)
  useCheckForUpdates()

  const onShow = (action: Action) => () => {
    setState((prevState) => ({
      ...prevState,
      [`show${action}`]: true,
    }))
  }

  const onHide = (action: Action) => () => {
    setState((prevState) => ({
      ...prevState,
      [`show${action}`]: false,
    }))
  }

  const showSendFunds = (token: Token) => {
    setState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: true,
        selectedToken: token,
      },
    }))
  }

  const hideSendFunds = () => {
    setState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
    }))
  }
  const { sendFunds, showReceive } = state

  return (
    <Page>
      <Layout
        hideSendFunds={hideSendFunds}
        onHide={onHide}
        onShow={onShow}
        sendFunds={sendFunds}
        showReceive={showReceive}
        showSendFunds={showSendFunds}
      />
    </Page>
  )
}

export default SafeView
