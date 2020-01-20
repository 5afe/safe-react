// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import { xl, sm, border } from '~/theme/variables'

type Props = {
  classes: Object,
  onTxCancel: Function,
  showCancelBtn: boolean,
}

const styles = () => ({
  buttonRow: {
    borderTop: `2px solid ${border}`,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px 20px',
  },
  button: {
    height: xl,
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
  <Row align="end" className={classes.buttonRow}>
    {showCancelBtn && (
      <Button className={classes.button} variant="contained" minWidth={140} color="secondary" onClick={onTxCancel}>
        Cancel
      </Button>
    )}
  </Row>
)

export default withStyles(styles)(ButtonRow)
