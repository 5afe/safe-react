import { createContext, forwardRef, MutableRefObject, ReactElement, ReactNode, useEffect, useState } from 'react'
import { InViewHookResponse, useInView } from 'react-intersection-observer'

export const INFINITE_SCROLL_CONTAINER = 'infinite-scroll-container'

export const InfiniteScrollContext = createContext<{
  ref: MutableRefObject<HTMLDivElement | null> | ((instance: HTMLDivElement | null) => void) | null
  lastItemId?: string
  setLastItemId: (itemId?: string) => void
}>({ setLastItemId: () => {}, ref: null })

export const InfiniteScrollProvider = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children }, ref): ReactElement => {
    const [lastItemId, _setLastItemId] = useState<string>()

    const setLastItemId = (itemId?: string) => {
      setTimeout(() => _setLastItemId(itemId), 0)
    }

    return (
      <InfiniteScrollContext.Provider value={{ ref, lastItemId, setLastItemId }}>
        {children}
      </InfiniteScrollContext.Provider>
    )
  },
)

InfiniteScrollProvider.displayName = 'InfiniteScrollProvider'

type InfiniteScrollProps = {
  children: ReactNode
  next: () => Promise<void>
  config?: InViewHookResponse
}

export const InfiniteScroll = ({ children, next, config }: InfiniteScrollProps): ReactElement => {
  const { ref, inView } = useInView({
    threshold: 0,
    root: document.querySelector(`#${INFINITE_SCROLL_CONTAINER}`),
    rootMargin: '0px 0px 200px 0px',
    triggerOnce: true,
    ...config,
  })

  useEffect(() => {
    // Avoid memory leak - queue/history have separate InfiniteScroll wrappers
    let isMounted = true

    if (isMounted && inView) {
      next()
    }

    return () => {
      isMounted = false
    }
  }, [inView, next])

  return <InfiniteScrollProvider ref={ref}>{children}</InfiniteScrollProvider>
}
