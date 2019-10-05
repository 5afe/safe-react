// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import { sm, lg, background } from '~/theme/variables'

type Props = {
  onTxConfirm: Function,
  onTxCancel: Function,
  onTxExecute: Function,
  classes: Object,
  showConfirmBtn: boolean,
  showCancelBtn: boolean,
  showExecuteBtn: boolean,
}

const styles = () => ({
  buttonRow: {
    height: '56px',
    justifyContent: 'center',
    backgroundColor: background,
  },
  button: {
    height: '32px',
    '&:last-child': {
      marginLeft: lg,
    },
  },
  icon: {
    width: '14px',
    height: '14px',
    marginRight: sm,
  },
})

const ButtonRow = ({
  classes,
  onTxCancel,
  showCancelBtn,
}: Props) => (
  <Row align="right" className={classes.buttonRow}>
    {showCancelBtn && (
      <Button className={classes.button} variant="contained" minWidth={140} color="secondary" onClick={onTxCancel}>
        Cancel tx
      </Button>
    )}
  </Row>
)

export default withStyles(styles)(ButtonRow)
