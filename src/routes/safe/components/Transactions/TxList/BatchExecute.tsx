import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { store } from 'src/store'
import { lg, sm, md } from 'src/theme/variables'
import Button from 'src/components/layout/Button'
import { ButtonStatus, Modal } from 'src/components/Modal'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { getExecutionTransaction } from 'src/logic/safe/transactions'
import { getGnosisSafeInstanceAt, getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getMultiSendJoinedTxs, MultiSendTx } from 'src/logic/safe/transactions/multisend'
import { extractSafeAddress } from 'src/routes/routes'
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
import { getTxConfirmations, getTxInfo } from 'src/routes/safe/components/Transactions/TxList/utils'

async function getBatchExecuteData(
  dispatch: Dispatch,
  transactions: Transaction[],
  safeInstance: GnosisSafe,
  safeAddress: string,
  account: string,
) {
  const batchableTransactionsWithDetails = await Promise.all(
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

  const txs: MultiSendTx[] = batchableTransactionsWithDetails.map((transaction) => {
    const txInfo = getTxInfo(transaction, safeAddress)
    const confirmations = getTxConfirmations(transaction)
    const sigs = generateSignaturesFromTxConfirmations(confirmations, undefined)

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

const BatchExecute = (): ReactElement => {
  const hoverContext = useContext(BatchExecuteHoverContext)
  const dispatch = useDispatch<Dispatch>()
  const safeAddress = extractSafeAddress()
  const { address, currentVersion } = useSelector(currentSafe)
  const account = useSelector(userAccountSelector)
  const safeInstance = getGnosisSafeInstanceAt(address, currentVersion)
  const multiSendContractAddress = getMultisendContractAddress()
  const batchableTransactions = useSelector(getBatchableTransactions)
  const [isModalOpen, setModalOpen] = useState(false)
  const [buttonStatus, setButtonStatus] = useState(ButtonStatus.LOADING)
  const [multiSendCallData, setMultiSendCallData] = useState(EMPTY_DATA)
  const hasPendingTx = useMemo(
    () => batchableTransactions.some(({ id }) => isTxPending(store.getState(), id)),
    [batchableTransactions],
  )

  const handleOnMouseEnter = useCallback(() => {
    hoverContext.setActiveHover(batchableTransactions.map((tx) => tx.id))
  }, [batchableTransactions, hoverContext])

  const handleOnMouseLeave = useCallback(() => {
    hoverContext.setActiveHover()
  }, [hoverContext])

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const handleOpenModal = () => {
    toggleModal()

    const handleGetBatchExecuteData = async () => {
      const batchExecuteData = await getBatchExecuteData(
        dispatch,
        batchableTransactions,
        safeInstance,
        safeAddress,
        account,
      )
      setButtonStatus(ButtonStatus.READY)
      setMultiSendCallData(batchExecuteData)
    }
    handleGetBatchExecuteData()
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
        disabled={batchableTransactions.length <= 1 || hasPendingTx}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        Execute Batch {batchableTransactions.length > 1 ? `(${batchableTransactions.length})` : ''}
      </StyledButton>
      <Modal description="Execute Batch" handleClose={toggleModal} open={isModalOpen} title="Execute Batch">
        <ModalHeader onClose={toggleModal} title="Batch-Execute transactions" />
        <Hairline />
        <ModalContent>
          <Row margin="md">
            <Paragraph noMargin>This action will execute {batchableTransactions.length} transactions.</Paragraph>
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
          <Paragraph size="md" align="center" color="disabled" noMargin>
            Be aware that if any of the transactions fail, all of them will revert.
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
}

const StyledButton = styled(Button)`
  align-self: flex-end;
  margin-right: ${sm};
  margin-top: -51px;
  margin-bottom: ${md};
`

const ModalContent = styled.div`
  padding: ${lg} ${lg} 0;
`

// Since there are no props we can safely use memoize
export const MemoizedBatchExecute = React.memo(BatchExecute)
