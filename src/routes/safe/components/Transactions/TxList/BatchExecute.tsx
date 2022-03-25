import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { lg, sm, md } from 'src/theme/variables'
import Button from 'src/components/layout/Button'
import { Modal } from 'src/components/Modal'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { isMultiSigExecutionDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import {
  Erc20Transfer,
  Erc721Transfer,
  MultisigExecutionInfo,
  Operation,
  TransactionDetails,
  TransactionInfo,
  TransactionTokenType,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { List } from 'immutable'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { getExecutionTransaction } from 'src/logic/safe/transactions'
import {
  getGnosisSafeInstanceAt,
  getMultisendContract,
  getMultisendContractAddress,
} from 'src/logic/contracts/safeContracts'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getMultiSendJoinedTxs, MultiSendTx } from 'src/logic/safe/transactions/multisend'
import { extractSafeAddress } from 'src/routes/routes'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getBatchableTransactions } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { DecodeTxs } from 'src/components/DecodeTxs'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import Row from 'src/components/layout/Row'
import Paragraph from 'src/components/layout/Paragraph'
import { fetchTxDecoder } from 'src/utils/decodeTx'
import { DecodedTxDetailType } from 'src/routes/safe/components/Apps/components/ConfirmTxModal'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe'
import Hairline from 'src/components/layout/Hairline'
import { getInteractionTitle } from 'src/routes/safe/components/Transactions/helpers/utils'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { createMultiSendTransaction } from 'src/logic/safe/store/actions/TxMultiSender'
import { BatchExecuteHoverContext } from 'src/routes/safe/components/Transactions/TxList/BatchExecuteHoverProvider'
import { TxArgs } from 'src/logic/safe/store/models/types/transaction'

type TxInfoProps = Pick<
  TxArgs,
  | 'data'
  | 'baseGas'
  | 'gasPrice'
  | 'safeTxGas'
  | 'gasToken'
  | 'nonce'
  | 'refundReceiver'
  | 'valueInWei'
  | 'to'
  | 'operation'
>

function getTxInfo(transaction: Transaction, safeAddress: string): TxInfoProps {
  if (!transaction.txDetails) return {} as TxInfoProps

  const data = transaction.txDetails.txData?.hexData ?? EMPTY_DATA
  const baseGas = isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)
    ? transaction.txDetails.detailedExecutionInfo.baseGas
    : '0'
  const gasPrice = isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)
    ? transaction.txDetails.detailedExecutionInfo.gasPrice
    : '0'
  const safeTxGas = isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)
    ? transaction.txDetails.detailedExecutionInfo.safeTxGas
    : '0'
  const gasToken = isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)
    ? transaction.txDetails.detailedExecutionInfo.gasToken
    : ZERO_ADDRESS
  const nonce = (transaction.executionInfo as MultisigExecutionInfo)?.nonce ?? 0
  const refundReceiver = isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)
    ? transaction.txDetails.detailedExecutionInfo.refundReceiver.value
    : ZERO_ADDRESS
  const valueInWei = getTxValue(transaction.txInfo, transaction.txDetails)
  const to = getTxRecipient(transaction.txInfo, safeAddress)
  const operation = transaction.txDetails.txData?.operation ?? Operation.CALL

  return {
    data,
    baseGas,
    gasPrice,
    safeTxGas,
    gasToken,
    nonce,
    refundReceiver,
    valueInWei,
    to,
    operation,
  }
}

function getTxConfirmations(transaction: Transaction) {
  if (!transaction.txDetails) return List([])

  return transaction.txDetails.detailedExecutionInfo &&
    isMultiSigExecutionDetails(transaction.txDetails.detailedExecutionInfo)
    ? List(
        transaction.txDetails.detailedExecutionInfo.confirmations.map(({ signer, signature }) =>
          makeConfirmation({ owner: signer.value, signature }),
        ),
      )
    : List([])
}

function getTxValue(txInfo: TransactionInfo, txDetails: TransactionDetails) {
  switch (txInfo.type) {
    case 'Transfer':
      if (txInfo.transferInfo.type === TransactionTokenType.NATIVE_COIN) {
        return txInfo.transferInfo.value
      } else {
        return txDetails.txData?.value ?? '0'
      }
    case 'Custom':
      return txInfo.value
    case 'Creation':
    case 'SettingsChange':
    default:
      return '0'
  }
}

function getTxRecipient(txInfo: TransactionInfo, safeAddress: string) {
  switch (txInfo.type) {
    case 'Transfer':
      if (txInfo.transferInfo.type === TransactionTokenType.NATIVE_COIN) {
        return txInfo.recipient.value
      } else {
        return (txInfo.transferInfo as Erc20Transfer | Erc721Transfer).tokenAddress
      }
    case 'Custom':
      return txInfo.to.value
    case 'Creation':
    case 'SettingsChange':
    default:
      return safeAddress
  }
}

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
  const multiSendInstance = getMultisendContract()
  const multiSendContractAddress = getMultisendContractAddress()
  const batchableTransactions = useSelector(getBatchableTransactions)
  const [isModalOpen, setModalOpen] = useState(false)
  const [multiSendCallData, setMultiSendCallData] = useState(EMPTY_DATA)
  const [decodedData, setDecodedData] = useState<DecodedTxDetailType>()

  useEffect(() => {
    let isCurrent = true

    const decodeTxData = async () => {
      const encodeMultiSendCallData = multiSendInstance.methods.multiSend(multiSendCallData).encodeABI()
      const res = await fetchTxDecoder(encodeMultiSendCallData)
      if (res && isCurrent) {
        setDecodedData(res)
      }
    }

    decodeTxData()
    return () => {
      isCurrent = false
    }
  }, [multiSendCallData, multiSendInstance.methods])

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
        disabled={batchableTransactions.length <= 1}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        Batch-Execute {batchableTransactions.length > 1 ? `(${batchableTransactions.length})` : ''}
      </StyledButton>
      <Modal description="Batch-Execute" handleClose={toggleModal} open={isModalOpen} title="Batch-Execute">
        <ModalHeader onClose={toggleModal} title="Batch-execute transactions" />
        <Hairline />
        <ModalContent>
          <Row margin="md">
            <Paragraph noMargin>This action will execute {batchableTransactions.length} Transactions.</Paragraph>
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
          <Row>
            <DecodeTxs txs={batchableTransactions as any} decodedData={decodedData} />
          </Row>
          <Paragraph size="md" align="center" color="disabled" noMargin>
            Be aware that if any of the transactions fail, all of them will revert.
          </Paragraph>
        </ModalContent>
        <Modal.Footer withoutBorder>
          <Modal.Footer.Buttons
            cancelButtonProps={{ onClick: toggleModal, text: 'Cancel' }}
            confirmButtonProps={{
              onClick: handleBatchExecute,
              disabled: batchableTransactions.length <= 1,
              text: 'Submit',
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
  margin-top: ${md};
`

const ModalContent = styled.div`
  padding: ${lg} ${lg} 0;
`

export const MemoizedBatchExecute = React.memo(BatchExecute)
