// @flow
import * as React from 'react'
import Modal from '@material-ui/core/Modal'
import { withStyles } from '@material-ui/core/styles'

type Props = {
  title: string,
  description: string,
  open: boolean,
  handleClose: Function,
  children: React$Node,
  classes: Object,
}

const styles = theme => ({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
})

const GnoModal = ({
  title, description, open, children, handleClose, classes,
}: Props) => (
  <Modal
    aria-labelledby={title}
    aria-describedby={description}
    open={open}
    onClose={handleClose}
    className={classes.root}
  >
    <div className={classes.paper}>
      { children }
    </div>
  </Modal>
)

export default withStyles(styles)(GnoModal)
