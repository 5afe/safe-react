import React from 'react'
//import { useSelector } from 'react-redux'

import Layout from 'src/routes/safe/components/Layout'
// import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
// import { useLoadSafe } from '../../../logic/safe/hooks/useLoadSafe'
// import { useSafeScheduledUpdates } from './hooks/useSafeScheduledUpdates'
// import useSafeActions from './hooks/useSafeActions'

const SafeView = (): React.ReactElement => {
  // const safeAddress = useSelector(safeParamAddressFromStateSelector)
  // useLoadSafe(safeAddress)
  // useSafeScheduledUpdates(safeAddress)
  // const { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds } = useSafeActions()

  return (
    <Layout
    // showReceive={safeActionsState.showReceive as boolean}
    // sendFunds={safeActionsState.sendFunds}
    // onHide={onHide}
    // onShow={onShow}
    // showSendFunds={showSendFunds}
    // hideSendFunds={hideSendFunds}
    />
  )
}

export default SafeView
