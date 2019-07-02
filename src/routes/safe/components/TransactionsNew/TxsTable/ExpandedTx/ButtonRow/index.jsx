// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import { lg } from '~/theme/variables'

type Props = {
  onTxConfirm: Function,
  onTxCancel: Function,
  classes: Object,
}

const styles = () => ({
  buttonRow: {
    height: '56px',
    justifyContent: 'center',
    backgroundColor: '#f7f8fb',
  },
  button: {
    height: '32px',
    '&:last-child': {
      marginLeft: lg,
    },
  },
})

const ButtonRow = ({ classes, onTxCancel, onTxConfirm }: Props) => (
  <Row align="center" className={classes.buttonRow}>
    <Button className={classes.button} variant="contained" minWidth={140} color="secondary" onClick={onTxCancel}>
      Cancel TX
    </Button>
    <Button className={classes.button} variant="contained" minWidth={140} color="primary" onClick={onTxConfirm}>
      Confirm TX
    </Button>
  </Row>
)

export default withStyles(styles)(ButtonRow)
