import { Loader } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { default as ReactInfiniteScroll, Props as ReactInfiniteScrollProps } from 'react-infinite-scroll-component'
import styled from 'styled-components'

import { Overwrite } from 'src/types/helpers'

export const Centered = styled.div<{ padding?: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  padding: ${({ padding }) => `${padding}px`};
  justify-content: center;
  align-items: center;
`

export const SCROLLABLE_TARGET_ID = 'scrollableDiv'

type InfiniteScrollProps = Overwrite<ReactInfiniteScrollProps, { loader?: ReactInfiniteScrollProps['loader'] }>

export const InfiniteScroll = ({ dataLength, next, hasMore, ...props }: InfiniteScrollProps): ReactElement => {
  return (
    <ReactInfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={dataLength}
      next={next}
      hasMore={hasMore}
      loader={
        <Centered>
          <Loader size="md" />
        </Centered>
      }
      scrollThreshold="120px"
      scrollableTarget={SCROLLABLE_TARGET_ID}
    >
      {props.children}
    </ReactInfiniteScroll>
  )
}
