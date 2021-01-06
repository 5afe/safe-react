import { Text } from '@gnosis.pm/safe-react-components'
import { format } from 'date-fns'
import React, { ReactElement } from 'react'

import { isCreationTxInfo, isTransferTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TokenTransferAmount } from 'src/routes/safe/components/GatewayTransactions/TokenTransferAmount'
import { NoPaddingAccordion, StyledTransaction } from './styled'
import { TxDetails } from './TxDetails'
import { TxInfoCreation } from './TxInfoCreation'
import { TxType } from './TxType'

export const TxRow = ({ transaction }: { transaction: Transaction }): ReactElement => {
  // TODO-1: summary and details as children
  // TODO-2: extract summaryContent as component
  return (
    <NoPaddingAccordion
      summaryContent={
        <StyledTransaction>
          <div className="tx-nonce">
            <Text size="lg">{transaction.executionInfo?.nonce}</Text>
          </div>
          <div className="tx-type">
            <TxType tx={transaction} />
          </div>
          <div className="tx-info">
            {isTransferTxInfo(transaction.txInfo) && <TokenTransferAmount txInfo={transaction.txInfo} />}
          </div>
          <div className="tx-time">
            <Text size="lg">{format(transaction.timestamp, 'h:mm a')}</Text>
          </div>
          <div className="tx-votes" />
          <div className="tx-actions" />
          <div className="tx-status">
            <Text size="lg" color={transaction.txStatus === 'SUCCESS' ? 'primary' : 'error'} className="col" strong>
              {transaction.txStatus === 'SUCCESS' ? 'Success' : 'Fail'}
            </Text>
          </div>
        </StyledTransaction>
      }
      detailsContent={
        isCreationTxInfo(transaction.txInfo) ? (
          <TxInfoCreation transaction={transaction} />
        ) : (
          <TxDetails transactionId={transaction.id} />
        )
      }
    />
  )
}
