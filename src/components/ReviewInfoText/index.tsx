import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'

import Paragraph from 'src/components/layout/Paragraph'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { getLastTxNonce } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { lg } from 'src/theme/variables'
import { getRecommendedNonce } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { extractSafeAddress } from 'src/routes/routes'
import { useEffect, useState } from 'react'
import { TransactionFailText } from '../TransactionFailText'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'

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
  const transactionAction = isCreation ? 'create' : isExecution ? 'execute' : 'approve'

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
      <Paragraph size="md" align="center" color="disabled" noMargin>
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
        <>
          <Paragraph size="md" align="center" color="disabled" noMargin>
            You&apos;re about to {transactionAction} a transaction and will have to confirm it with your currently
            connected wallet.
          </Paragraph>
          {txEstimationExecutionStatus === EstimationStatus.FAILURE && (
            <TransactionFailText isExecution={isExecution} />
          )}
        </>
      )}
    </ReviewInfoTextWrapper>
  )
}
