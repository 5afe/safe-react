import { theme } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

const Block = styled.div`
  padding-top: 24px;
  padding-left: 16px;
  padding-bottom: 16px;
  border-right: 2px solid ${theme.colors.separator};
`

export const TxDetails = ({ children }: { children: ReactNode }): ReactElement => <Block>{children}</Block>
