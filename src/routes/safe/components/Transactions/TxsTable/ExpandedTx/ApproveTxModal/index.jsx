// @flow
import React, { useState } from 'react'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { SharedSnackbarConsumer } from '~/components/SharedSnackBar'
import Modal from '~/components/Modal'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
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
}: Props) => {
  const [approveAndExecute, setApproveAndExecute] = useState<boolean>(false)
  const { title, description } = getModalTitleAndDescription(thresholdReached)
  const oneConfirmationLeft = tx.confirmations.size + 1 === threshold

  const handleExecuteCheckbox = () => setApproveAndExecute(prevApproveAndExecute => !prevApproveAndExecute)

  return (
    <SharedSnackbarConsumer>
      {({ openSnackbar }) => {
        const approveTx = () => {
          processTransaction(safeAddress, tx, openSnackbar, userAddress, approveAndExecute)
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
                {!thresholdReached && oneConfirmationLeft && (
                  <>
                    <Paragraph color="error">
                      Approving transaction does not execute it immediately. If you want to approve and execute the
                      transaction right away, click on checkbox below.
                    </Paragraph>
                    <FormControlLabel
                      control={<Checkbox onChange={handleExecuteCheckbox} checked={approveAndExecute} color="primary" />}
                      label="Execute transaction"
                    />
                  </>
                )}
              </Row>
            </Block>
            <Row align="center" className={classes.buttonRow}>
              <Button className={classes.button} minWidth={140} minHeight={42} onClick={onClose}>
                Exit
              </Button>
              <Button
                type="submit"
                className={classes.button}
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
      }}
    </SharedSnackbarConsumer>
  )
}

export default withStyles(styles)(ApproveTxModal)
