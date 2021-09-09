import { useState, useCallback } from 'react'

type StateType = { isOpen: boolean; message: string; requestId: string }

const INITIAL_MODAL_STATE: StateType = {
  isOpen: false,
  message: '',
  requestId: '',
}

type ReturnType = [StateType, (message: string, requestId: string) => void, () => void]

export const useSignMessageModal = (): ReturnType => {
  const [signMessageModalState, setSignMessageModalState] = useState<StateType>(INITIAL_MODAL_STATE)

  const openSignMessageModal = useCallback((message: string, requestId: string) => {
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
