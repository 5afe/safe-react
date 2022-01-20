import { ReactElement, ReactNode } from 'react'

import { StyledDetailsTitle, StyledTxInfoDetails } from 'src/routes/safe/components/Transactions/TxList/styled'

type InfoDetailsProps = {
  children: ReactNode
  title: string | ReactElement
  uppercase?: boolean
}

export const InfoDetails = ({ children, title, uppercase = true }: InfoDetailsProps): ReactElement => (
  <StyledTxInfoDetails>
    {typeof title === 'string' ? (
      <StyledDetailsTitle size="sm" strong color="placeHolder" uppercase={uppercase}>
        {title}
      </StyledDetailsTitle>
    ) : (
      title
    )}

    {children}
  </StyledTxInfoDetails>
)
