import { useState, useCallback } from 'react'

export type ReturnValue = {
  open: boolean
  toggle: (e?: Event) => void
  clickAway: () => void
}

export const useStateHandler = (openInitialValue = false): ReturnValue => {
  const [open, setOpen] = useState(openInitialValue)
  const toggle = useCallback((e?: Event) => {
    e?.stopPropagation()

    setOpen((prevOpen) => !prevOpen)
  }, [])
  const clickAway = useCallback(() => setOpen(false), [])

  return {
    open,
    toggle,
    clickAway,
  }
}
