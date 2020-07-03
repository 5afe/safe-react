import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import Page from 'src/components/layout/Page'

import Layout from 'src/routes/safe/components/Layout'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { useLoadSafe } from './hooks/useLoadSafe'
import { useSafeScheduledUpdates } from './hooks/useSafeScheduledUpdates'

const INITIAL_STATE = {
  sendFunds: {
    isOpen: false,
    selectedToken: undefined,
  },
  showReceive: false,
}

const SafeView = (): JSX.Element => {
  const [state, setState] = useState(INITIAL_STATE)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  useLoadSafe(safeAddress)
  useSafeScheduledUpdates(safeAddress)

  const onShow = (action) => () => {
    setState((prevState) => ({
      ...prevState,
      [`show${action}`]: true,
    }))
  }

  const onHide = (action) => () => {
    setState((prevState) => ({
      ...prevState,
      [`show${action}`]: false,
    }))
  }

  const showSendFunds = (token) => {
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
