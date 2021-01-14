import { Loader } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { default as ReactInfiniteScroll, Props as ReactInfiniteScrollProps } from 'react-infinite-scroll-component'

import { Overwrite } from 'src/types/helpers'

export const SCROLLABLE_TARGET_ID = 'scrollableDiv'

type InfiniteScrollProps = Overwrite<ReactInfiniteScrollProps, { loader?: ReactInfiniteScrollProps['loader'] }>

export const InfiniteScroll = ({ dataLength, next, hasMore, ...props }: InfiniteScrollProps): ReactElement => {
  return (
    <ReactInfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      loader={<Loader size="md" />}
      scrollThreshold="120px"
      scrollableTarget={SCROLLABLE_TARGET_ID}
    >
      {props.children}
    </ReactInfiniteScroll>
  )
}
