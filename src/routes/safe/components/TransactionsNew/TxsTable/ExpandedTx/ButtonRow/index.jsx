// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import BlockIcon from '@material-ui/icons/Block'
import Row from '~/components/layout/Row'
import Button from '~/components/layout/Button'
import { sm, lg } from '~/theme/variables'

type Props = {
  onTxConfirm: Function,
  onTxCancel: Function,
  classes: Object,
  showConfirmBtn: boolean,
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
  icon: {
    width: '14px',
    height: '14px',
    marginRight: sm,
  },
})

const ButtonRow = ({
  classes, onTxCancel, onTxConfirm, showConfirmBtn,
}: Props) => (
  <Row align="center" className={classes.buttonRow}>
    <Button className={classes.button} variant="contained" minWidth={140} color="secondary" onClick={onTxCancel}>
      <BlockIcon className={classes.icon} />
      {' '}
Cancel TX
    </Button>
    {showConfirmBtn && (
      <Button className={classes.button} variant="contained" minWidth={140} color="primary" onClick={onTxConfirm}>
        <EditIcon className={classes.icon} />
        {' '}
Confirm TX
      </Button>
    )}
  </Row>
)

export default withStyles(styles)(ButtonRow)
