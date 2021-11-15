import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import Paragraph from 'src/components/layout/Paragraph'
import { TransactionFailText } from 'src/components/TransactionFailText'
import { Text } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'
import { currentNetwork } from 'src/logic/config/store/selectors'

type TransactionFailTextProps = {
  txEstimationExecutionStatus: EstimationStatus
  gasCostFormatted?: string
  isExecution: boolean
  isCreation: boolean
  isOffChainSignature: boolean
}

export const TransactionFees = ({
  gasCostFormatted,
  isExecution,
  isCreation,
  isOffChainSignature,
  txEstimationExecutionStatus,
}: TransactionFailTextProps): React.ReactElement | null => {
  const { nativeCurrency } = useSelector(currentNetwork)
  let transactionAction
  if (txEstimationExecutionStatus === EstimationStatus.LOADING) {
    return null
  }
  if (isCreation) {
    transactionAction = 'create'
  } else if (isExecution) {
    transactionAction = 'execute'
  } else {
    transactionAction = 'approve'
  }

  return (
    <>
      {gasCostFormatted != null && (
        <Paragraph size="lg" align="center">
          You&apos;re about to {transactionAction} a transaction and will have to confirm it with your currently
          connected wallet.{' '}
          {!isOffChainSignature && (
            <>
              Make sure you have{' '}
              <Text size="lg" as="span" color="text" strong>
                {gasCostFormatted}
              </Text>{' '}
              (fee price) {nativeCurrency.name} in this wallet to fund this confirmation.
            </>
          )}
        </Paragraph>
      )}
      <TransactionFailText txEstimationExecutionStatus={txEstimationExecutionStatus} isExecution={isExecution} />
    </>
  )
}
