import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Paragraph from 'src/components/layout/Paragraph'
import { lg } from 'src/theme/variables'
import { TransactionFailText } from '../TransactionFailText'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import useRecommendedNonce from 'src/logic/hooks/useRecommendedNonce'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'

const ReviewInfoTextWrapper = styled.div`
  padding: 0 ${lg};
`

type ReviewInfoTextProps = {
  txEstimationExecutionStatus: EstimationStatus
  isExecution: boolean
  isCreation: boolean
  isRejection: boolean
  safeNonce?: string
  testId?: string
}

export const ReviewInfoText = ({
  isCreation,
  isExecution,
  isRejection,
  safeNonce = '',
  testId,
  txEstimationExecutionStatus,
}: ReviewInfoTextProps): ReactElement => {
  const safeTxNonce = parseInt(safeNonce, 10)
  const { address: safeAddress } = useSelector(currentSafeWithNames)
  const recommendedNonce = useRecommendedNonce(safeAddress)

  const isTxNonceOutOfOrder = () => {
    // safeNonce can be undefined while waiting for the request.
    if (isNaN(safeTxNonce)) return false
    if (safeTxNonce === recommendedNonce) return false
    return true
  }

  const getWarning = (): ReactElement | null => {
    if (!isCreation || isRejection) return null
    if (!isTxNonceOutOfOrder()) return null

    const transactionsToGo = safeTxNonce - recommendedNonce

    return (
      <Paragraph size="md" align="center" color="disabled" noMargin>
        {transactionsToGo > 0 ? (
          /* tx in the future */ <>
            <b>{transactionsToGo}</b>
            &nbsp;{`transaction${transactionsToGo > 1 ? 's' : ''}`}&nbsp;will need to be created and executed before
            this transaction, are you sure you want to do this?
          </>
        ) : (
          /* tx in the past */ <>
            Nonce&nbsp;
            <b>{safeTxNonce}</b>
            &nbsp;is below the latest transaction&apos;s nonce in your queue. Please verify the submitted nonce. The
            next recommended nonce is &nbsp;
            <b>{recommendedNonce}</b>.
          </>
        )}
      </Paragraph>
    )
  }

  return (
    <ReviewInfoTextWrapper data-testid={testId}>
      {getWarning() || (
        <>
          <Paragraph size="md" align="center" color="disabled" noMargin>
            You&apos;re about to {isCreation ? 'create' : isExecution ? 'execute' : 'approve'} a{' '}
            {isRejection ? 'rejection ' : ''}transaction and will have to confirm it with your currently connected
            wallet.
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
