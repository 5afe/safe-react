import { BytesLike } from '@gnosis.pm/safe-apps-sdk'
import { useState, useCallback } from 'react'

type StateType = { isOpen: boolean; message: BytesLike; requestId: string }

const INITIAL_MODAL_STATE: StateType = {
  isOpen: false,
  message: '',
  requestId: '',
}

type ReturnType = [StateType, (message: BytesLike, requestId: string) => void, () => void]

export const useSignMessageModal = (): ReturnType => {
  const [signMessageModalState, setSignMessageModalState] = useState<StateType>({
    isOpen: false,
    message: '',
    requestId: '',
  })

  const openSignMessageModal = useCallback((message: BytesLike, requestId: string) => {
    setSignMessageModalState({
      ...INITIAL_MODAL_STATE,
      isOpen: true,
      message,
      requestId,
    })
  }, [])

  const closeSignMessageModal = useCallback(() => {
    setSignMessageModalState(INITIAL_MODAL_STATE)
  }, [])

  return [signMessageModalState, openSignMessageModal, closeSignMessageModal]
}