import { Loader, Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { useTransactionDetails } from './hooks/useTransactionDetails'
import { TxDetailsContainer, Centered } from './styled'
import { TxDetails } from './TxDetails'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TransactionActions } from './hooks/useTransactionActions'

type TxStoreDetailsProps = {
  transaction: Transaction
  actions?: TransactionActions
}

export const TxStoreDetails = ({ transaction, ...props }: TxStoreDetailsProps): ReactElement => {
  const { data, loading } = useTransactionDetails(transaction.id)

  if (loading) {
    return (
      <Centered padding={10}>
        <Loader size="sm" />
      </Centered>
    )
  }

  if (!data) {
    return (
      <TxDetailsContainer>
        <Text size="xl" strong>
          No data available
        </Text>
      </TxDetailsContainer>
    )
  }

  const tx = {
    ...transaction,
    txDetails: { ...transaction.txDetails, ...data },
  }

  return <TxDetails transaction={tx} {...props} />
}
