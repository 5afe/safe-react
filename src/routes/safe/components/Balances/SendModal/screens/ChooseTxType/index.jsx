// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import { lg, sm } from '~/theme/variables'

const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  manage: {
    fontSize: '24px',
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  buttonColumn: {
    padding: '52px 0',
  },
  secondButton: {
    marginTop: 10,
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
  setActiveScreen: Function,
}

const ChooseTxType = ({ classes, onClose, setActiveScreen }: Props) => (
  <>
    <Row align="center" grow className={classes.heading}>
      <Paragraph weight="bolder" className={classes.manage} noMargin>
        Send
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
    <Hairline />
    <Row align="center">
      <Col layout="column" middle="xs" className={classes.buttonColumn}>
        <Button
          color="primary"
          minWidth={260}
          minHeight={52}
          onClick={() => setActiveScreen('sendFunds')}
          variant="contained"
        >
          SEND FUNDS
        </Button>
        <Button
          color="primary"
          className={classes.secondButton}
          minWidth={260}
          minHeight={52}
          onClick={() => setActiveScreen('sendCustomTx')}
          variant="outlined"
        >
          SEND CUSTOM TRANSACTION
        </Button>
      </Col>
    </Row>
  </>
)

export default withStyles(styles)(ChooseTxType)
