import { useState, useCallback } from 'react'
import { EIP712TypedData, Methods } from '@gnosis.pm/safe-apps-sdk'

type StateType = {
  isOpen: boolean
  requestId: string
  message: string | EIP712TypedData
  method: Methods.signMessage | Methods.signTypedMessage
}

const INITIAL_MODAL_STATE: StateType = {
  isOpen: false,
  message: '',
  requestId: '',
  method: Methods.signMessage,
}

type ReturnType = [
  StateType,
  (message: string | EIP712TypedData, requestId: string, method: Methods) => void,
  () => void,
]

export const useSignMessageModal = (): ReturnType => {
  const [signMessageModalState, setSignMessageModalState] = useState<StateType>(INITIAL_MODAL_STATE)

  const openSignMessageModal = useCallback(
    (message: string | EIP712TypedData, requestId: string, method: Methods.signTypedMessage | Methods.signMessage) => {
      setSignMessageModalState({
        ...INITIAL_MODAL_STATE,
        isOpen: true,
        message,
        requestId,
        method,
      })
    },
    [],
  )

  const closeSignMessageModal = useCallback(() => {
    setSignMessageModalState(INITIAL_MODAL_STATE)
  }, [])

  return [signMessageModalState, openSignMessageModal, closeSignMessageModal]
}
