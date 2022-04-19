import { lg, black500, extraLargeFontSize } from 'src/theme/variables'
import styled from 'styled-components'

export const WidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const WidgetTitle = styled.h2`
  color: ${black500};
  font-size: ${extraLargeFontSize};
  margin-top: 0;
`

export const WidgetBody = styled.div<{ filled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
`

export const Card = styled.div`
  background: #fff;
  padding: ${lg};
  border-radius: 8px;
  flex-grow: 1;

  & > h2 {
    margin-top: 0;
  }
`
