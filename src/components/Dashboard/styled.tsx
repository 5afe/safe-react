import { lg } from 'src/theme/variables'
import styled from 'styled-components'

export const WidgetContainer = styled.div`
  flex: 1;
  /* To delete */
  /* border: 1px solid black; */
`

export const WidgetTitle = styled.h2``

export const WidgetBody = styled.div<{ filled?: boolean }>`
  flex: 1;
  /* background: #fff; */
  /* border-radius: 8px; */
  /* background: ${({ filled }) => (filled ? '#fff' : 'none')};
  border-radius: ${({ filled }) => (filled ? '8' : '0')}px;
  padding: ${({ filled }) => (filled ? '40' : '0')}px; */
  /* padding: 40px; */
`

export const Card = styled.div`
  background: #fff;
  padding: ${lg};
  border-radius: 8px;
  flex: 1;
  /* margin: 10px; */

  & > h2 {
    margin-top: 0;
  }
`
