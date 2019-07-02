// @flow
import React from 'react'
import { List } from 'immutable'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import cn from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Modal from '~/components/Modal'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  createTransaction: Function,
}

const CancelTxModal = ({
  onClose, isOpen, classes, createTransaction,
}: Props) => (
  <Modal
    title="Cancel Transaction"
    description="CancelTransaction"
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
  </Modal>
)

export default withStyles(styles)(CancelTxModal)
