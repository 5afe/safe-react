import { useState, useMemo } from 'react'

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

type Response = {
  onShow: (action: string) => void
  onHide: (action: string) => void
  showSendFunds: (token: string) => void
  hideSendFunds: () => void
  safeActionsState: Record<string, unknown>
}

const useSafeActions = (): Response => {
  const [safeActionsState, setSafeActionsState] = useState<SafeActionState>(INITIAL_STATE)

  const onShow = useMemo(
    () => (action) => {
      setSafeActionsState((prevState) => ({
        ...prevState,
        [`show${action}`]: true,
      }))
    },
    [],
  )

  const onHide = useMemo(
    () => (action) => {
      setSafeActionsState((prevState) => ({
        ...prevState,
        [`show${action}`]: false,
      }))
    },
    [],
  )

  const showSendFunds = useMemo(
    () => (token) => {
      setSafeActionsState((prevState) => ({
        ...prevState,
        sendFunds: {
          isOpen: true,
          selectedToken: token,
        },
      }))
    },
    [],
  )

  const hideSendFunds = useMemo(
    () => () => {
      setSafeActionsState((prevState) => ({
        ...prevState,
        sendFunds: {
          isOpen: false,
          selectedToken: '',
        },
      }))
    },
    [],
  )

  return { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds }
}

export default useSafeActions
