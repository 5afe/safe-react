import { ReactElement } from 'react'
import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'

import Paragraph from 'src/components/layout/Paragraph'
import { lg } from 'src/theme/variables'
import { extractSafeAddress } from 'src/routes/routes'
import { TransactionFailText } from '../TransactionFailText'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import useRecommendedNonce from 'src/logic/hooks/useRecommendedNonce'

const WarningMessage = ({ safeTxNonceParam }: { safeTxNonceParam: string }): ReactElement | null => {
  const safeTxNonce = parseInt(safeTxNonceParam, 10)
  const safeAddress = extractSafeAddress()
  const recommendedNonce = useRecommendedNonce(safeAddress)

  const isTxNonceOutOfOrder = () => {
    // safeNonce can be undefined while waiting for the request.
    if (isNaN(safeTxNonce)) return false
    if (safeTxNonce === recommendedNonce) return false
    return true
  }

  if (!isTxNonceOutOfOrder()) return null

  const transactionsToGo = safeTxNonce - recommendedNonce

  return (
    <Paragraph size="md" align="center" color="disabled" noMargin>
      {transactionsToGo < 0 ? (
        `Nonce ${safeTxNonce} has already been used. Your transaction will fail. Please use nonce ${recommendedNonce}.`
      ) : (
        <>
          <Text size="lg" as="span" color="text" strong>
            {transactionsToGo}
          </Text>
          {` transaction${transactionsToGo > 1 ? 's' : ''} will need to be created and executed before this transaction,
      are you sure you want to do this?`}
        </>
      )}
    </Paragraph>
  )
}

const ReviewInfoTextWrapper = styled.div`
  padding: 0 ${lg};
`

type ReviewInfoTextProps = {
  txEstimationExecutionStatus: EstimationStatus
  isExecution: boolean
  isCreation: boolean
  safeNonce?: string
  testId?: string
}

export const ReviewInfoText = ({
  isCreation,
  isExecution,
  safeNonce = '',
  testId,
  txEstimationExecutionStatus,
}: ReviewInfoTextProps): ReactElement => {
  const warning = <WarningMessage safeTxNonceParam={safeNonce} />

  return (
    <ReviewInfoTextWrapper data-testid={testId}>
      {warning || (
        <>
          <Paragraph size="md" align="center" color="disabled" noMargin>
            You&apos;re about to {isCreation ? 'create' : isExecution ? 'execute' : 'approve'} a transaction and will
            have to confirm it with your currently connected wallet.
          </Paragraph>
        </>
      )}
      <TransactionFailText
        estimationStatus={txEstimationExecutionStatus}
        isExecution={isExecution}
        isCreation={isCreation}
      />
    </ReviewInfoTextWrapper>
  )
}
