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

const VirtualizedList: typeof Virtuoso = ({ children, style, ...props }): ReactElement => {
  useEffect(() => {
    window.addEventListener('error', ignoreResizeObserverErrors)
    return () => window.removeEventListener('error', ignoreResizeObserverErrors)
  }, [])

  return (
    <Virtuoso
      style={{
        height: 'calc(100% - 54px)', // Remove breadcrumb height
        ...style,
      }}
      {...props}
    >
      {children}
    </Virtuoso>
  )
}

export default VirtualizedList
