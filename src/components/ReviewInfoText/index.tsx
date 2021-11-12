import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import Paragraph from 'src/components/layout/Paragraph'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { lg, sm } from 'src/theme/variables'
import { TransactionFees } from '../TransactionsFees'

type ReviewInfoTextProps = Parameters<typeof TransactionFees>[0] & { safeNonce?: string; testId?: string }

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
  txEstimationExecutionStatus,
  testId,
}: ReviewInfoTextProps): React.ReactElement => {
  const { nonce } = useSelector(currentSafe)
  const transactionsToGo = parseInt(safeNonce, 10) - nonce

  return (
    <ReviewInfoTextWrapper data-testid={testId}>
      {transactionsToGo > 0 ? (
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
