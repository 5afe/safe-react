// @flow
import * as React from 'react'
import cn from 'classnames'
import Modal from '@material-ui/core/Modal'
import { withStyles } from '@material-ui/core/styles'

type Props = {
  title: string,
  description: string,
  open: boolean,
  handleClose: Function,
  children: React$Node,
  classes: Object,
  modalClassName: ?string,
  paperClassName: ?string,
}

const styles = () => ({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  paper: {
    position: 'absolute',
    top: '120px',
    width: '500px',
    height: '530px',
    borderRadius: '3px',
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
  title, description, open, children, handleClose, modalClassName, classes, paperClassName,
}: Props) => (
  <Modal
    aria-labelledby={title}
    aria-describedby={description}
    open={open}
    onClose={handleClose}
    className={cn(classes.root, modalClassName)}
  >
    <div className={cn(classes.paper, paperClassName)}>{children}</div>
  </Modal>
)

export default withStyles(styles)(GnoModal)
