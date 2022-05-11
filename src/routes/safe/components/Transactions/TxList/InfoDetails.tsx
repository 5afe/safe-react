import { ReactElement, ReactNode } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'

import { StyledTxInfoDetails } from 'src/routes/safe/components/Transactions/TxList/styled'

type InfoDetailsProps = {
  header?: string | ReactElement
  children: ReactNode
  title: string | ReactElement
}

export const InfoDetails = ({ header, children, title }: InfoDetailsProps): ReactElement => (
  <StyledTxInfoDetails>
    {header}
    <Text size="xl" as="span" strong>
      {title}
    </Text>
    {children}
  </StyledTxInfoDetails>
)
