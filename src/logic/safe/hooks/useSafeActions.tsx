import { useState, useCallback } from 'react'

type SafeActionState = {
  sendFunds: {
    isOpen: boolean
    selectedToken: string
  }
  showReceive: boolean
}

const INITIAL_STATE: SafeActionState = {
  sendFunds: {
    isOpen: false,
    selectedToken: '',
  },
  showReceive: false,
}

type ReturnType = {
  onShow: (action: Action) => void
  onHide: (action: Action) => void
  showSendFunds: (token: string) => void
  hideSendFunds: () => void
  safeActionsState: SafeActionState
}

type Action = 'Receive'

const useSafeActions = (): ReturnType => {
  const [safeActionsState, setSafeActionsState] = useState<SafeActionState>(INITIAL_STATE)

  const onShow = useCallback((action) => {
    setSafeActionsState((prevState) => ({
      ...prevState,
      [`show${action}`]: true,
    }))
  }, [])

  const onHide = useCallback((action) => {
    setSafeActionsState((prevState) => ({
      ...prevState,
      [`show${action}`]: false,
    }))
  }, [])

  const showSendFunds = useCallback((token) => {
    setSafeActionsState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: true,
        selectedToken: token,
      },
    }))
  }, [])

  const hideSendFunds = useCallback(() => {
    setSafeActionsState((prevState) => ({
      ...prevState,
      sendFunds: {
        isOpen: false,
        selectedToken: '',
      },
    }))
  }, [])

  return { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds }
}

export default useSafeActions
