import { ReactElement, ReactNode } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'

import { StyledDetailsTitle, StyledTxInfoDetails } from 'src/routes/safe/components/Transactions/TxList/styled'

type InfoDetailsProps = {
  children: ReactNode
  title: string | ReactElement
  uppercase?: boolean
}

export const InfoDetails = ({ children, title, uppercase = true }: InfoDetailsProps): ReactElement => (
  <StyledTxInfoDetails>
    {uppercase ? (
      <StyledDetailsTitle size="sm" strong color="placeHolder">
        {title}
      </StyledDetailsTitle>
    ) : (
      <Text size="sm" strong color="placeHolder">
        {title}
      </Text>
    )}

    {children}
  </StyledTxInfoDetails>
)
