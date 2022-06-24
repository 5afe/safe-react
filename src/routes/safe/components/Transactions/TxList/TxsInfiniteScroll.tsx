import { Loader } from '@gnosis.pm/safe-react-components'
import { ReactElement, ReactNode } from 'react'

import { INFINITE_SCROLL_CONTAINER, InfiniteScroll } from 'src/components/InfiniteScroll'
import { HorizontallyCentered, ScrollableTransactionsContainer } from './styled'

type TxsInfiniteScrollProps = {
  children: ReactNode
  next: () => Promise<void>
  isLoading: boolean
}

export const TxsInfiniteScroll = ({ children, next, isLoading }: TxsInfiniteScrollProps): ReactElement => {
  return (
    <InfiniteScroll next={next}>
      <ScrollableTransactionsContainer id={INFINITE_SCROLL_CONTAINER}>
        {children}
        <HorizontallyCentered isVisible={isLoading}>
          <Loader size="md" />
        </HorizontallyCentered>
      </ScrollableTransactionsContainer>
    </InfiniteScroll>
  )
}

export { InfiniteScrollContext as TxsInfiniteScrollContext } from 'src/components/InfiniteScroll'
