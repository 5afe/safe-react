import Modal from '@material-ui/core/Modal'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'

import { sm } from 'src/theme/variables'

const styles = () => ({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    overflowY: 'scroll',
  },
  paper: {
    position: 'absolute',
    top: '120px',
    width: '500px',
    height: '530px',
    borderRadius: sm,
    backgroundColor: '#ffffff',
    boxShadow: '0 0 5px 0 rgba(74, 85, 121, 0.5)',
    '&:focus': {
      outline: 'none',
    },
    display: 'flex',
    flexDirection: 'column',
  },
})

const GnoModal = ({
  children,
  classes,
  description,
  handleClose,
  modalClassName,
  open,
  paperClassName,
  title,
}: any) => (
  <Modal
    aria-describedby={description}
    aria-labelledby={title}
    className={cn(classes.root, modalClassName)}
    onClose={handleClose}
    open={open}
  >
    <div className={cn(classes.paper, paperClassName)}>{children}</div>
  </Modal>
)

export default withStyles(styles as any)(GnoModal)
