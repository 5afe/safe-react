import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppReduxState } from 'src/store'
import { lg, sm, md } from 'src/theme/variables'
import Button from 'src/components/layout/Button'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { isCustomTxInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { getExecutionTransaction } from 'src/logic/safe/transactions'
import { getGnosisSafeInstanceAt, getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getMultiSendJoinedTxs, MultiSendTx } from 'src/logic/safe/transactions/multisend'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getBatchableTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import Row from 'src/components/layout/Row'
import Paragraph from 'src/components/layout/Paragraph'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe'
import Hairline from 'src/components/layout/Hairline'
import { getInteractionTitle } from 'src/routes/safe/components/Transactions/helpers/utils'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { createMultiSendTransaction } from 'src/logic/safe/store/actions/TxMultiSender'
import { BatchExecuteHoverContext } from 'src/routes/safe/components/Transactions/TxList/BatchExecuteHoverProvider'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'
import { isTxPending } from 'src/logic/safe/store/selectors/pendingTransactions'
import {
  getTxConfirmations,
  getTxInfo,
  getTxRecipient,
  getTxValue,
} from 'src/routes/safe/components/Transactions/TxList/utils'
import { TX_LIST_EVENTS } from 'src/utils/events/txList'
import { DecodedTxDetailType } from 'src/routes/safe/components/Apps/components/ConfirmTxModal'
import { DecodeTxs } from 'src/components/DecodeTxs'
import { DecodedDataParameterValue } from '@gnosis.pm/safe-react-gateway-sdk'
import { trackEvent } from 'src/utils/googleTagManager'
import { Skeleton } from '@material-ui/lab'

const DecodedTransactions = ({
  transactions,
  safeAddress,
}: {
  transactions: Transaction[]
  safeAddress: string
}): ReactElement => {
  return (
    <div>
      {transactions.map((transaction) => {
        if (!transaction.txDetails?.txData) return null

        const tx = {
          to: getTxRecipient(transaction.txInfo, safeAddress),
          value: getTxValue(transaction.txInfo, transaction.txDetails),
          data: transaction.txDetails?.txData.hexData || EMPTY_DATA,
        }
        const decodedDataParams: DecodedDataParameterValue = {
          operation: 0,
          to: tx.to,
          value: tx.value,
          data: transaction.txDetails?.txData.hexData || EMPTY_DATA,
          dataDecoded: null,
        }

        if (isCustomTxInfo(transaction.txInfo) && transaction.txInfo.isCancellation) {
          decodedDataParams.dataDecoded = {
            method: 'On-chain rejection',
            parameters: [],
          }
        }

        const decodedData = transaction.txDetails?.txData.dataDecoded || decodedDataParams

        return <DecodeTxs txs={[tx]} decodedData={decodedData as DecodedTxDetailType} key={transaction.id} />
      })}
    </div>
  )
}

async function getTxDetails(transactions: Transaction[], dispatch: Dispatch) {
  return Promise.all(
    transactions.map(async (transaction) => {
      if (transaction.txDetails) return transaction

      const txDetails = await dispatch(fetchTransactionDetails({ transactionId: transaction.id }))

      const transactionDetails = txDetails || (await fetchSafeTransaction(transaction.id))
      return {
        ...transaction,
        txDetails: transactionDetails,
      }
    }),
  )
}

async function getBatchExecuteData(
  dispatch: Dispatch,
  transactions: Transaction[],
  safeInstance: GnosisSafe,
  safeAddress: string,
  account: string,
) {
  const txs: MultiSendTx[] = transactions.map((transaction) => {
    const txInfo = getTxInfo(transaction, safeAddress)
    const confirmations = getTxConfirmations(transaction)
    const sigs = generateSignaturesFromTxConfirmations(confirmations)

    const txArgs: TxArgs = { ...txInfo, sigs, safeInstance, sender: account }
    const data = getExecutionTransaction(txArgs).encodeABI()

    return {
      to: safeAddress,
      value: '0',
      data,
    }
  })

  return getMultiSendJoinedTxs(txs)
}

// Memoized as it receives no props
export const BatchExecute = React.memo((): ReactElement => {
  const hoverContext = useContext(BatchExecuteHoverContext)
  const dispatch = useDispatch<Dispatch>()
  const { address: safeAddress, currentVersion } = useSelector(currentSafe)
  const account = useSelector(userAccountSelector)
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, currentVersion)
  const multiSendContractAddress = getMultisendContractAddress()
  const batchableTransactions = useSelector(getBatchableTransactions)
  const [txsWithDetails, setTxsWithDetails] = useState<Transaction[]>([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [buttonStatus, setButtonStatus] = useState(ButtonStatus.LOADING)
  const [multiSendCallData, setMultiSendCallData] = useState(EMPTY_DATA)
  const store = useSelector((state: AppReduxState) => state)
  const hasPendingTx = useMemo(
    () => batchableTransactions.some(({ id }) => isTxPending(store, id)),
    [batchableTransactions, store],
  )
  const isBatchable = batchableTransactions.length > 1

  const handleOnMouseEnter = useCallback(() => {
    hoverContext.setActiveHover(batchableTransactions.map((tx) => tx.id))
  }, [batchableTransactions, hoverContext])

  const handleOnMouseLeave = useCallback(() => {
    hoverContext.setActiveHover()
  }, [hoverContext])

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const handleOpenModal = async () => {
    toggleModal()

    trackEvent({
      ...TX_LIST_EVENTS.BATCH_EXECUTE,
      label: batchableTransactions.length,
    })

    const transactionsWithDetails = await getTxDetails(batchableTransactions, dispatch)
    setTxsWithDetails(transactionsWithDetails)

    const batchExecuteData = await getBatchExecuteData(
      dispatch,
      transactionsWithDetails,
      safeInstance,
      safeAddress,
      account,
    )

    setButtonStatus(ButtonStatus.READY)
    setMultiSendCallData(batchExecuteData)
  }

  const handleBatchExecute = async () => {
    createMultiSendTransaction({
      transactions: batchableTransactions,
      multiSendCallData,
      dispatch,
      account,
      safeAddress,
    })

    toggleModal()
  }

  return (
    <>
      <StyledButton
        color="primary"
        variant="contained"
        onClick={handleOpenModal}
        disabled={!isBatchable || hasPendingTx}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        Execute Batch {isBatchable ? `(${batchableTransactions.length})` : ''}
      </StyledButton>
      <Modal description="Execute Batch" handleClose={toggleModal} open={isModalOpen} title="Execute Batch">
        <ModalHeader onClose={toggleModal} title="Batch-Execute transactions" />
        <Hairline />
        <ModalContent>
          <Row margin="md">
            <Paragraph noMargin>
              This transaction batches a total of {batchableTransactions.length} transactions from your queue into a
              single Ethereum transaction. Please check every included transaction carefully, especially if you have
              rejection transactions, and make sure you want to execute all of them. Included transactions are
              highlighted in green when you hover over the execute button.
            </Paragraph>
          </Row>
          <Row margin="xs">
            <Paragraph color="disabled" noMargin size="lg">
              {getInteractionTitle('0')}
            </Paragraph>
          </Row>
          <Row margin="md">
            <PrefixedEthHashInfo
              hash={multiSendContractAddress}
              showAvatar
              textSize="lg"
              showCopyBtn
              explorerUrl={getExplorerInfo(multiSendContractAddress)}
            />
          </Row>
          <Row margin="md">
            <DecodeTxsWrapper>
              {txsWithDetails.length ? (
                <DecodedTransactions transactions={txsWithDetails} safeAddress={safeAddress} />
              ) : (
                batchableTransactions.map((transaction) => (
                  <SkeletonWrapper key={transaction.id}>
                    <Skeleton variant="rect" height="52px" />
                  </SkeletonWrapper>
                ))
              )}
            </DecodeTxsWrapper>
          </Row>
          <Paragraph size="md" align="center" color="disabled" noMargin>
            This feature is still in experimental mode. Be aware that if any of the included transactions reverts, none
            of them will be executed. This will result in the loss of the allocated transaction fees.
          </Paragraph>
        </ModalContent>
        <Modal.Footer withoutBorder>
          <Modal.Footer.Buttons
            cancelButtonProps={{ onClick: toggleModal, text: 'Cancel' }}
            confirmButtonProps={{
              status: buttonStatus,
              onClick: handleBatchExecute,
              disabled: batchableTransactions.length <= 1 || buttonStatus === ButtonStatus.LOADING,
              text: buttonStatus === ButtonStatus.LOADING ? 'Loading' : 'Submit',
            }}
          />
        </Modal.Footer>
      </Modal>
    </>
  )
})

BatchExecute.displayName = 'BatchExecute'

const StyledButton = styled(Button)`
  display: block;
  align-self: flex-end;
  margin-right: ${sm};
  margin-top: -51px;
  margin-bottom: ${md};
`

const ModalContent = styled.div`
  padding: ${lg} ${lg} 0;
`

const DecodeTxsWrapper = styled.div`
  width: 100%;
`

const SkeletonWrapper = styled.div`
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`
