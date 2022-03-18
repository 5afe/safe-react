import { useDispatch } from 'react-redux'
import { useStyles } from './style'
import Modal from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { ExpandedTxDetails, isMultisigExecutionInfo, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { extractSafeAddress } from 'src/routes/routes'
import { Overwrite } from 'src/types/helpers'
import { TxModalWrapper } from '../../helpers/TxModalWrapper'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'

type Props = {
  isOpen: boolean
  onClose: () => void
  transaction: Overwrite<Transaction, { txDetails: ExpandedTxDetails }>
}

export const RejectTxModal = ({ isOpen, onClose, transaction }: Props): React.ReactElement => {
  const dispatch = useDispatch()
  const safeAddress = extractSafeAddress()
  const classes = useStyles()
  const executionInfo = isMultisigExecutionInfo(transaction.executionInfo) ? transaction.executionInfo : undefined

  const origin = transaction.safeAppInfo
    ? JSON.stringify({ name: transaction.safeAppInfo.name, url: transaction.safeAppInfo.url })
    : ''

  const nonce = isMultisigExecutionInfo(transaction.executionInfo) ? transaction.executionInfo.nonce : 0

  const sendReplacementTransaction = (txParameters: TxParameters, delayExecution: boolean) => {
    dispatch(
      createTransaction({
        safeAddress,
        to: safeAddress,
        valueInWei: '0',
        txNonce: nonce,
        origin,
        safeTxGas: txParameters.safeTxGas,
        ethParameters: txParameters,
        notifiedTransaction: TX_NOTIFICATION_TYPES.CANCELLATION_TX,
        delayExecution,
      }),
    )
    onClose()
  }

  return (
    <Modal description="Reject transaction" handleClose={onClose} open={isOpen} title="Reject Transaction">
      <TxModalWrapper
        txNonce={nonce.toString()}
        txThreshold={executionInfo?.confirmationsRequired}
        txData={EMPTY_DATA}
        onSubmit={sendReplacementTransaction}
        onClose={onClose}
        isRejectTx
        submitText="Reject transaction"
      >
        <ModalHeader onClose={onClose} title="Reject transaction" />
        <Hairline />
        <Block className={classes.container}>
          <Row>
            <Paragraph>
              This action will reject this transaction. A separate transaction will be performed to submit the
              rejection.
            </Paragraph>
            <Paragraph color="medium" size="sm">
              Transaction nonce:
              <br />
              <Bold className={classes.nonceNumber}>{nonce}</Bold>
            </Paragraph>
          </Row>
        </Block>
      </TxModalWrapper>
    </Modal>
  )
}
