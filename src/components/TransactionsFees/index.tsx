import React from 'react'
import { EstimationStatus } from 'src/logic/hooks/useEstimateTransactionGas'
import Paragraph from 'src/components/layout/Paragraph'
import { getNetworkInfo } from 'src/config'
import { TransactionFailText } from 'src/components/TransactionFailText'
import { useSelector } from 'react-redux'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { sameString } from 'src/utils/strings'
import { WALLETS } from 'src/config/networks/network.d'

type TransactionFailTextProps = {
  txEstimationExecutionStatus: EstimationStatus
  gasCostFormatted: string
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
  const providerName = useSelector(providerNameSelector)

  let transactionAction
  if (isCreation) {
    transactionAction = 'create'
  } else if (isExecution) {
    transactionAction = 'execute'
  } else {
    transactionAction = 'approve'
  }

  // FIXME this should be removed when estimating with WalletConnect correctly
  if (!providerName || sameString(providerName, WALLETS.WALLET_CONNECT)) {
    return null
  }

  return (
    <>
      <Paragraph>
        You&apos;re about to {transactionAction} a transaction and will have to confirm it with your currently connected
        wallet.
        {!isOffChainSignature &&
          ` Make sure you have ${gasCostFormatted} (fee price) ${nativeCoin.name} in this wallet to fund this confirmation.`}
      </Paragraph>
      <TransactionFailText txEstimationExecutionStatus={txEstimationExecutionStatus} isExecution={isExecution} />
    </>
  )
}
