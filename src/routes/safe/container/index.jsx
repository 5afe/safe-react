// @flow
import * as React from 'react'
import { useState } from 'react'

import Page from '~/components/layout/Page'
import { type Token } from '~/logic/tokens/store/model/token'
import Layout from '~/routes/safe/components/Layout'
import CheckForUpdates from '~/routes/safe/container/CheckForUpdates'

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

  const onShow = (action: Action) => () => {
    setState(() => ({ [`show${action}`]: true }))
  }

  const onHide = (action: Action) => () => {
    setState(() => ({ [`show${action}`]: false }))
  }

  const showSendFunds = (token: Token) => {
    setState({
      sendFunds: {
        isOpen: true,
        selectedToken: token,
      },
    })
  }

  const hideSendFunds = () => {
    setState({
      sendFunds: {
        isOpen: false,
        selectedToken: undefined,
      },
    })
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
      <CheckForUpdates />
    </Page>
  )
}

export default SafeView
