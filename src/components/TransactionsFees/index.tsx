import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import Paragraph from 'src/components/layout/Paragraph'
import { getNativeCurrency } from 'src/config'
import { TransactionFailText } from 'src/components/TransactionFailText'
import { Text } from '@gnosis.pm/safe-react-components'

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
  const nativeCurrency = getNativeCurrency()
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
              Make sure you have
              <Text size="lg" as="span" color="text" strong>
                {' '}
                {gasCostFormatted} {nativeCurrency.symbol}{' '}
              </Text>
              in this wallet to fund the associated transaction fee.
            </>
          )}
        </Paragraph>
      )}
      <TransactionFailText txEstimationExecutionStatus={txEstimationExecutionStatus} isExecution={isExecution} />
    </>
  )
}
