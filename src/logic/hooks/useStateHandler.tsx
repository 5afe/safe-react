import { useState } from 'react'

export type ReturnValue = {
  open: boolean
  toggle: () => void
  clickAway: () => void
}

export const useStateHandler = (openInitialValue = false): ReturnValue => {
  const [open, setOpen] = useState(openInitialValue)

  return {
    open,
    toggle: () => setOpen((open) => !open),
    clickAway: () => setOpen(false),
  }
}
