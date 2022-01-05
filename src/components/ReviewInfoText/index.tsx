import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import Paragraph from 'src/components/layout/Paragraph'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { getLastTxNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { lg, sm } from 'src/theme/variables'
import { TransactionFees } from '../TransactionsFees'
import { getRecommendedNonce } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { extractSafeAddress } from 'src/routes/routes'
import { useEffect, useState } from 'react'

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
  safeNonce: txParamsSafeNonce = '',
  testId,
  txEstimationExecutionStatus,
}: ReviewInfoTextProps): React.ReactElement => {
  const { nonce } = useSelector(currentSafe)
  const safeNonceNumber = parseInt(txParamsSafeNonce, 10)
  const lastTxNonce = useSelector(getLastTxNonce)
  const storeNextNonce = `${lastTxNonce && lastTxNonce + 1}`
  const safeAddress = extractSafeAddress()
  const [recommendedNonce, setRecommendedNonce] = useState<string>(storeNextNonce)

  useEffect(() => {
    const fetchRecommendedNonce = async () => {
      try {
        const recommendedNonce = (await getRecommendedNonce(safeAddress)).toString()
        setRecommendedNonce(recommendedNonce)
      } catch (e) {
        return
      }
    }
    fetchRecommendedNonce()
  }, [safeAddress])

  const warningMessage = () => {
    const isTxNonceOutOfOrder = () => {
      // safeNonce can be undefined while waiting for the request.
      if (isNaN(safeNonceNumber) || safeNonceNumber === nonce) return false
      if (lastTxNonce !== undefined && safeNonceNumber === lastTxNonce + 1) return false
      return true
    }
    const shouldShowWarning = isTxNonceOutOfOrder()
    if (!shouldShowWarning) return null

    const transactionsToGo = safeNonceNumber - nonce
    return (
      <Paragraph size="lg" align="center">
        {transactionsToGo < 0 ? (
          `Nonce ${txParamsSafeNonce} has already been used. Your transaction will fail. Please use nonce ${recommendedNonce}.`
        ) : (
          <>
            <Text size="lg" as="span" color="text" strong>
              {transactionsToGo}
            </Text>
            {` transaction${
              transactionsToGo > 1 ? 's' : ''
            } will need to be created and executed before this transaction,
        are you sure you want to do this?`}
          </>
        )}
      </Paragraph>
    )
  }

  return (
    <ReviewInfoTextWrapper data-testid={testId}>
      {warningMessage() || (
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
