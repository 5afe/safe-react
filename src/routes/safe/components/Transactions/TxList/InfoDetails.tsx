import { ReactElement, ReactNode } from 'react'

import { StyledDetailsTitle, StyledTxInfoDetails } from 'src/routes/safe/components/Transactions/TxList/styled'

type InfoDetailsProps = {
  children: ReactNode
  title: string | ReactElement
}

export const InfoDetails = ({ children, title }: InfoDetailsProps): ReactElement => (
  <StyledTxInfoDetails>
    <StyledDetailsTitle size="sm" strong color="placeHolder">
      {title}
    </StyledDetailsTitle>
    {children}
  </StyledTxInfoDetails>
)
