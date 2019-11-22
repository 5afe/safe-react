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

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  processTransaction: Function,
  tx: Transaction,
  nonce: string,
  safeAddress: string,
  threshold: number,
  thresholdReached: boolean,
  userAddress: string,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
}

const getModalTitleAndDescription = (thresholdReached: boolean) => {
  const title = thresholdReached ? 'Execute Transaction' : 'Approve Transaction'
  const description = `This action will ${
    thresholdReached ? 'execute' : 'approve'
  } this transaction. A separate transaction will be performed to submit the ${
    thresholdReached ? 'execution' : 'approval'
  }.`

  return {
    title,
    description,
  }
}

const ApproveTxModal = ({
  onClose,
  isOpen,
  classes,
  processTransaction,
  tx,
  safeAddress,
  threshold,
  thresholdReached,
  userAddress,
  enqueueSnackbar,
  closeSnackbar,
}: Props) => {
  const oneConfirmationLeft = !thresholdReached && tx.confirmations.size + 1 === threshold
  const [approveAndExecute, setApproveAndExecute] = useState<boolean>(oneConfirmationLeft || thresholdReached)
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  const { title, description } = getModalTitleAndDescription(thresholdReached)

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

  const handleExecuteCheckbox = () => setApproveAndExecute((prevApproveAndExecute) => !prevApproveAndExecute)

  const approveTx = () => {
    processTransaction(
      safeAddress,
      tx,
      userAddress,
      TX_NOTIFICATION_TYPES.CONFIRMATION_TX,
      enqueueSnackbar,
      closeSnackbar,
      approveAndExecute && oneConfirmationLeft,
    )
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
        <Row>
          <Paragraph>{description}</Paragraph>
          <Paragraph size="sm" color="medium">
            Transaction nonce:
            <br />
            <Bold className={classes.nonceNumber}>{tx.nonce}</Bold>
          </Paragraph>
          {oneConfirmationLeft && (
            <>
              <Paragraph color="error">
                Approving this transaction executes it right away. If you want approve but execute the transaction
                manually later, click on the checkbox below.
              </Paragraph>
              <FormControlLabel
                control={<Checkbox onChange={handleExecuteCheckbox} checked={approveAndExecute} color="primary" />}
                label="Execute transaction"
              />
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
          color="primary"
          onClick={approveTx}
          testId={APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID}
        >
          {title}
        </Button>
      </Row>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(ApproveTxModal))
