import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import Paragraph from 'src/components/layout/Paragraph'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { getLastTxNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { lg, sm } from 'src/theme/variables'
import { TransactionFees } from '../TransactionsFees'

type CustomReviewInfoTextProps = {
  safeNonce?: string
  testId?: string
}

type ReviewInfoTextProps = Parameters<typeof TransactionFees>[0] & CustomReviewInfoTextProps

const ReviewInfoTextWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${sm} ${lg};
`

export const ReviewInfoText = ({
  gasCostFormatted,
  isCreation,
  isExecution,
  isOffChainSignature,
  safeNonce = '',
  testId,
  txEstimationExecutionStatus,
}: ReviewInfoTextProps): React.ReactElement => {
  const { nonce } = useSelector(currentSafe)
  const safeNonceNumber = parseInt(safeNonce, 10)
  const lastTxNonce = useSelector(getLastTxNonce)

  const isTxNonceOutOfOrder = () => {
    if (safeNonceNumber === nonce) return false
    if (lastTxNonce !== undefined && safeNonceNumber === lastTxNonce + 1) return false
    return true
  }
  const shouldShowWarning = isTxNonceOutOfOrder()

  const transactionsToGo = safeNonceNumber - nonce

  return (
    <ReviewInfoTextWrapper data-testid={testId}>
      {shouldShowWarning ? (
        <Paragraph size="lg" align="center">
          <Text size="lg" as="span" color="text" strong>
            {transactionsToGo}
          </Text>
          {` transaction${
            transactionsToGo > 1 ? 's' : ''
          } will need to be created and executed before this transaction, are you
                sure you want to do this?`}
        </Paragraph>
      ) : (
        <TransactionFees
          gasCostFormatted={gasCostFormatted}
          isCreation={isCreation}
          isExecution={isExecution}
          isOffChainSignature={isOffChainSignature}
          txEstimationExecutionStatus={txEstimationExecutionStatus}
        />
      )}
    </ReviewInfoTextWrapper>
  )
}
