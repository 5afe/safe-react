// @flow
import React, { useState } from 'react'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Modal from '~/components/Modal'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  createTransaction: Function,
  tx: Transaction,
  nonce: string,
}

const ApproveTxModal = ({
  onClose, isOpen, classes, createTransaction, tx,
}: Props) => {
  const [shouldExecuteTx, setShouldExecuteTx] = useState<boolean>(false)

  const handleExecuteCheckbox = () => setShouldExecuteTx(prevShouldExecute => !prevShouldExecute)

  return (
    <Modal
      title="Approve Transaction"
      description="Approve Transaction"
      handleClose={onClose}
      open={isOpen}
      // paperClassName={cn(smallerModalSize && classes.smallerModalWindow)}
    >
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.headingText} noMargin>
          Approve transaction
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row>
          <Paragraph>
            This action will approve this transaction. A separate transaction will be performed to submit the approval.
          </Paragraph>
          <Paragraph size="sm" color="medium">
            Transaction nonce:
            <br />
            <Bold className={classes.nonceNumber}>{tx.nonce}</Bold>
          </Paragraph>
          <Paragraph color="error">
            Approving transaction does not execute it immediately. If you want to approve and execute the transaction
            right away, click on checkbox below.
          </Paragraph>
          <FormControlLabel
            control={<Checkbox onChange={handleExecuteCheckbox} checked={shouldExecuteTx} color="primary" />}
            label="Execute transaction"
          />
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
          data-testid="review-tx-btn"
        >
          Approve Transaction
        </Button>
      </Row>
    </Modal>
  )
}

export default withStyles(styles)(ApproveTxModal)
