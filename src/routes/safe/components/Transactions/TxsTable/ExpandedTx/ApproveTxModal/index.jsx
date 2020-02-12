// @flow
import React, { useState, useEffect } from 'react'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { withSnackbar } from 'notistack'
import Modal from '~/components/Modal'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { TX_NOTIFICATION_TYPES } from '~/logic/safe/transactions'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { styles } from './style'

export const APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID = 'approve-tx-modal-submit-btn'
export const REJECT_TX_MODAL_SUBMIT_BTN_TEST_ID = 'reject-tx-modal-submit-btn'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  isCancelTx?: boolean,
  processTransaction: Function,
  tx: Transaction,
  nonce: string,
  safeAddress: string,
  threshold: number,
  thresholdReached: boolean,
  userAddress: string,
  canExecute: boolean,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const getModalTitleAndDescription = (thresholdReached: boolean, isCancelTx?: boolean) => {
  const modalInfo = {
    title: 'Execute Transaction Rejection',
    description: 'This action will execute this transaction.',
  }

  if (isCancelTx) {
    return modalInfo
  }

  if (thresholdReached) {
    modalInfo.title = 'Execute Transaction'
    modalInfo.description =
      'This action will execute this transaction. A separate Transaction will be performed to submit the execution.'
  } else {
    modalInfo.title = 'Approve Transaction'
    modalInfo.description =
      'This action will approve this transaction. A separate Transaction will be performed to submit the approval.'
  }

  return modalInfo
}

const ApproveTxModal = ({
  onClose,
  isOpen,
  isCancelTx,
  classes,
  processTransaction,
  tx,
  safeAddress,
  threshold,
  canExecute,
  thresholdReached,
  userAddress,
  enqueueSnackbar,
  closeSnackbar,
}: Props) => {
  const [approveAndExecute, setApproveAndExecute] = useState<boolean>(canExecute)
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  const { title, description } = getModalTitleAndDescription(thresholdReached, isCancelTx)
  const oneConfirmationLeft = !thresholdReached && tx.confirmations.size + 1 === threshold
  const isTheTxReadyToBeExecuted = oneConfirmationLeft ? true : thresholdReached

  useEffect(() => {
    let isCurrent = true

    const estimateGas = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils

      const estimatedGasCosts = await estimateTxGasCosts(
        safeAddress,
        tx.recipient,
        tx.data,
        tx,
        approveAndExecute ? userAddress : undefined,
      )
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [approveAndExecute])

  const handleExecuteCheckbox = () => setApproveAndExecute(prevApproveAndExecute => !prevApproveAndExecute)

  const approveTx = () => {
    processTransaction({
      safeAddress,
      tx,
      userAddress,
      notifiedTransaction: TX_NOTIFICATION_TYPES.CONFIRMATION_TX,
      enqueueSnackbar,
      closeSnackbar,
      approveAndExecute: canExecute && approveAndExecute && isTheTxReadyToBeExecuted,
    })
    onClose()
  }

  return (
    <Modal title={title} description={description} handleClose={onClose} open={isOpen}>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.headingText} noMargin>
          {title}
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row style={{ flexDirection: 'column' }}>
          <Paragraph>{description}</Paragraph>
          <Paragraph size="sm" color="medium">
            Transaction nonce:
            <br />
            <Bold className={classes.nonceNumber}>{tx.nonce}</Bold>
          </Paragraph>
          {oneConfirmationLeft && canExecute && (
            <>
              <Paragraph color="error">
                Approving this transaction executes it right away.
                {!isCancelTx &&
                  ' If you want approve but execute the transaction manually later, click on the ' + 'checkbox below.'}
              </Paragraph>
              {!isCancelTx && (
                <FormControlLabel
                  control={<Checkbox onChange={handleExecuteCheckbox} checked={approveAndExecute} color="primary" />}
                  label="Execute transaction"
                />
              )}
            </>
          )}
        </Row>
        <Row>
          <Paragraph>
            {`You're about to ${
              approveAndExecute ? 'execute' : 'approve'
            } a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
          </Paragraph>
        </Row>
      </Block>
      <Row align="center" className={classes.buttonRow}>
        <Button minWidth={140} minHeight={42} onClick={onClose}>
          Exit
        </Button>
        <Button
          type="submit"
          variant="contained"
          minWidth={214}
          minHeight={42}
          color={isCancelTx ? 'secondary' : 'primary'}
          onClick={approveTx}
          testId={isCancelTx ? REJECT_TX_MODAL_SUBMIT_BTN_TEST_ID : APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID}
        >
          {title}
        </Button>
      </Row>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(ApproveTxModal))
