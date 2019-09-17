// @flow
import React from 'react'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import Modal from '~/components/Modal'
import Hairline from '~/components/layout/Hairline'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { type Variant } from '~/components/Header'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  createTransaction: Function,
  tx: Transaction,
  safeAddress: string,
  enqueueSnackbar: (message: string, variant: Variant) => void,
}

const CancelTxModal = ({
  onClose, isOpen, classes, createTransaction, tx, safeAddress, enqueueSnackbar,
}: Props) => {
  const sendReplacementTransaction = () => {
    createTransaction(safeAddress, safeAddress, 0, EMPTY_DATA, enqueueSnackbar)
    onClose()
  }

  return (
    <Modal
      title="Cancel Transaction"
      description="Cancel Transaction"
      handleClose={onClose}
      open={isOpen}
      // paperClassName={cn(smallerModalSize && classes.smallerModalWindow)}
    >
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.headingText} noMargin>
          Cancel transaction
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row>
          <Paragraph>
            This action will cancel this transaction. A separate transaction will be performed to submit the
            cancellation.
          </Paragraph>
          <Paragraph size="sm" color="medium">
            Transaction nonce:
            <br />
            <Bold className={classes.nonceNumber}>{tx.nonce}</Bold>
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
          color="secondary"
          onClick={sendReplacementTransaction}
        >
          Cancel Transaction
        </Button>
      </Row>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(CancelTxModal))
