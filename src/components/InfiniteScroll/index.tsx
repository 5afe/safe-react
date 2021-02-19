import React, {
  createContext,
  Dispatch,
  forwardRef,
  MutableRefObject,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useInView } from 'react-intersection-observer'

export const INFINITE_SCROLL_CONTAINER = 'infinite-scroll-container'

export const InfiniteScrollContext = createContext<{
  ref: MutableRefObject<HTMLDivElement | null> | ((instance: HTMLDivElement | null) => void) | null
  lastItemId?: string
  setLastItemId: Dispatch<SetStateAction<string>>
}>({ setLastItemId: () => {}, ref: null })

export const InfiniteScrollProvider = forwardRef<HTMLDivElement, { children: ReactNode }>(
  ({ children }, ref): ReactElement => {
    const [lastItemId, setLastItemId] = useState<string>()

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
  hasMore: boolean
  next: () => Promise<void>
}

export const InfiniteScroll = ({ children, hasMore, next }: InfiniteScrollProps): ReactElement => {
  const { ref, inView } = useInView({
    threshold: 0,
    root: document.querySelector(`#${INFINITE_SCROLL_CONTAINER}`),
    rootMargin: '0px 0px 200px 0px',
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView && hasMore) {
      next()
    }
  }, [inView, hasMore, next])

  return <InfiniteScrollProvider ref={ref}>{children}</InfiniteScrollProvider>
}
