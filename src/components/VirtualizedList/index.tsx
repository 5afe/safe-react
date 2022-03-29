import { useEffect, ReactElement } from 'react'
import { Virtuoso } from 'react-virtuoso'

// The ResizeObserver cannot deliver all observations in one animation frame.
// The author of the `ResizeObserver` spec assures that it can be safely ignored:
// https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded#comment86691361_49384120

const ignoreResizeObserverErrors = (e: ErrorEvent) => {
  const RESIZE_OBSERVER_ERRORS = [
    'ResizeObserver loop completed with undelivered notifications.',
    'ResizeObserver loop limit exceeded',
  ]
  if (RESIZE_OBSERVER_ERRORS.includes(e.message)) {
    e.stopImmediatePropagation()
  }
}

const VirtualizedList: typeof Virtuoso = ({ children, ...props }): ReactElement => {
  useEffect(() => {
    window.addEventListener('error', ignoreResizeObserverErrors)
    return () => window.removeEventListener('error', ignoreResizeObserverErrors)
  })

  return <Virtuoso {...props}>{children}</Virtuoso>
}

export default VirtualizedList
