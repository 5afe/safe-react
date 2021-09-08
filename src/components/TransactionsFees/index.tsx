import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import Paragraph from 'src/components/layout/Paragraph'
import { getNetworkInfo } from 'src/config'
import { TransactionFailText } from 'src/components/TransactionFailText'
import { Text } from '@gnosis.pm/safe-react-components'

type TransactionFailTextProps = {
  txEstimationExecutionStatus: EstimationStatus
  gasCostFormatted?: string
  isExecution: boolean
  isCreation: boolean
  isOffChainSignature: boolean
}
const { nativeCoin } = getNetworkInfo()

export const TransactionFees = ({
  gasCostFormatted,
  isExecution,
  isCreation,
  isOffChainSignature,
  txEstimationExecutionStatus,
}: TransactionFailTextProps): React.ReactElement | null => {
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
              (fee price) {nativeCoin.name} in this wallet to fund this confirmation.
            </>
          )}
        </Paragraph>
      )}
      <TransactionFailText txEstimationExecutionStatus={txEstimationExecutionStatus} isExecution={isExecution} />
    </>
  )
}
