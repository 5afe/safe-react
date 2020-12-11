import { theme } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

const Block = styled.div``

const WrapperBlock = styled(Block)`
  padding: 24px 16px;
  border-right: 2px solid ${theme.colors.separator};
  border-bottom: 2px solid ${theme.colors.separator};
`

export const TxSummary = ({ children }: { children: ReactNode }): ReactElement => (
  <WrapperBlock>{children}</WrapperBlock>
)
