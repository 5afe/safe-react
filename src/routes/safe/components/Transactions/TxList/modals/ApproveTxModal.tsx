import { List } from 'immutable'
import {
  Erc20Transfer,
  Erc721Transfer,
  MultisigExecutionInfo,
  Operation,
  TransactionTokenType,
} from '@gnosis.pm/safe-react-gateway-sdk'
import { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useStyles } from './style'

import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { processTransaction } from 'src/logic/safe/store/actions/processTransaction'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { Overwrite } from 'src/types/helpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import {
  ExpandedTxDetails,
  isMultiSigExecutionDetails,
  isMultisigExecutionInfo,
  Transaction,
} from 'src/logic/safe/store/models/types/gateway.d'
import { extractSafeAddress } from 'src/routes/routes'
import { TxModalWrapper } from '../../helpers/TxModalWrapper'
import { grantedSelector } from 'src/routes/safe/container/selector'

export const REJECT_TX_MODAL_SUBMIT_BTN_TEST_ID = 'reject-tx-modal-submit-btn'

const getModalTitleAndDescription = (thresholdReached: boolean): { title: string; description: string } => {
  const modalInfo = {
    title: 'Execute transaction rejection',
    description: 'This action will execute this transaction.',
  }

  if (thresholdReached) {
    modalInfo.title = 'Execute transaction'
    modalInfo.description = 'This action will execute this transaction.'
  } else {
    modalInfo.title = 'Approve Transaction'
    modalInfo.description =
      'This action will approve this transaction. A separate Transaction will be performed to submit the approval.'
  }

  return modalInfo
}

const useTxInfo = (transaction: Props['transaction']) => {
  const t = useRef(transaction)
  const safeAddress = extractSafeAddress()

  const confirmations = useMemo(
    () =>
      t.current.txDetails.detailedExecutionInfo && isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? List(
            t.current.txDetails.detailedExecutionInfo.confirmations.map(({ signer, signature }) =>
              makeConfirmation({ owner: signer.value, signature }),
            ),
          )
        : List([]),
    [],
  )

  const data = useMemo(() => t.current.txDetails.txData?.hexData ?? EMPTY_DATA, [])

  const baseGas = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.baseGas
        : '0',
    [],
  )

  const gasPrice = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.gasPrice
        : '0',
    [],
  )

  const safeTxGas = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.safeTxGas
        : '0',
    [],
  )

  const gasToken = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.gasToken
        : ZERO_ADDRESS,
    [],
  )

  const nonce = useMemo(() => (t.current.executionInfo as MultisigExecutionInfo)?.nonce ?? 0, [])

  const refundReceiver = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.refundReceiver.value
        : ZERO_ADDRESS,
    [],
  )

  const safeTxHash = useMemo(
    () =>
      isMultiSigExecutionDetails(t.current.txDetails.detailedExecutionInfo)
        ? t.current.txDetails.detailedExecutionInfo.safeTxHash
        : EMPTY_DATA,
    [],
  )

  const value = useMemo(() => {
    switch (t.current.txInfo.type) {
      case 'Transfer':
        if (t.current.txInfo.transferInfo.type === TransactionTokenType.NATIVE_COIN) {
          return t.current.txInfo.transferInfo.value
        } else {
          return t.current.txDetails.txData?.value ?? '0'
        }
      case 'Custom':
        return t.current.txInfo.value
      case 'Creation':
      case 'SettingsChange':
      default:
        return '0'
    }
  }, [])

  const to = useMemo(() => {
    switch (t.current.txInfo.type) {
      case 'Transfer':
        if (t.current.txInfo.transferInfo.type === TransactionTokenType.NATIVE_COIN) {
          return t.current.txInfo.recipient.value
        } else {
          return (t.current.txInfo.transferInfo as Erc20Transfer | Erc721Transfer).tokenAddress
        }
      case 'Custom':
        return t.current.txInfo.to.value
      case 'Creation':
      case 'SettingsChange':
      default:
        return safeAddress
    }
  }, [safeAddress])

  const operation = useMemo(() => t.current.txDetails.txData?.operation ?? Operation.CALL, [])

  const origin = useMemo(
    () =>
      t.current.safeAppInfo ? JSON.stringify({ name: t.current.safeAppInfo.name, url: t.current.safeAppInfo.url }) : '',
    [],
  )

  const id = useMemo(() => t.current.id, [])

  return {
    confirmations,
    data,
    baseGas,
    gasPrice,
    safeTxGas,
    gasToken,
    nonce,
    refundReceiver,
    safeTxHash,
    value,
    to,
    operation,
    origin,
    id,
  }
}

type Props = {
  onClose: () => void
  isOpen: boolean
  transaction: Overwrite<Transaction, { txDetails: ExpandedTxDetails }>
}

export const ApproveTxModal = ({ onClose, isOpen, transaction }: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const userAddress = useSelector(userAccountSelector)
  const isOwner = useSelector(grantedSelector)
  const classes = useStyles()
  const safeAddress = extractSafeAddress()
  const txInfo = useTxInfo(transaction)

  const { executionInfo } = transaction
  const { confirmationsSubmitted = 0, confirmationsRequired = 0 } = isMultisigExecutionInfo(executionInfo)
    ? executionInfo
    : {}
  const thresholdReached = confirmationsSubmitted >= confirmationsRequired
  const { description, title } = getModalTitleAndDescription(thresholdReached)

  let preApprovingOwner: string | undefined = undefined
  if (!thresholdReached && isOwner && confirmationsSubmitted === confirmationsRequired - 1) {
    preApprovingOwner = userAddress
  }

  const approveTx = (txParameters: TxParameters, delayExecution: boolean) => {
    dispatch(
      processTransaction({
        safeAddress,
        tx: txInfo,
        preApprovingOwner,
        notifiedTransaction: TX_NOTIFICATION_TYPES.CONFIRMATION_TX,
        approveAndExecute: !delayExecution,
        ethParameters: txParameters,
        thresholdReached,
      }),
    )
    onClose()
  }

  return (
    <Modal description={description} handleClose={onClose} open={isOpen} title={title}>
      <TxModalWrapper
        operation={txInfo.operation}
        txNonce={txInfo.nonce.toString()}
        txConfirmations={txInfo.confirmations}
        txThreshold={confirmationsRequired}
        txTo={txInfo.to}
        txData={txInfo.data}
        txValue={txInfo.value}
        safeTxGas={txInfo.safeTxGas}
        onSubmit={approveTx}
        onClose={onClose}
      >
        <ModalHeader onClose={onClose} title={title} />

        <Hairline />

        {/* Tx info */}
        <Block className={classes.container}>
          <Row style={{ flexDirection: 'column' }}>
            <Paragraph>{description}</Paragraph>
            <Paragraph color="medium" size="sm">
              Transaction nonce:
              <br />
              <Bold className={classes.nonceNumber}>{txInfo.nonce}</Bold>
            </Paragraph>
          </Row>
        </Block>
      </TxModalWrapper>
    </Modal>
  )
}
