// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Token from '../assets/token.svg'
import Code from '../assets/code.svg'
import { lg, md, sm } from '~/theme/variables'

const styles = () => ({
  heading: {
    padding: `${md} ${lg}`,
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
    '& > button': {
      fontSize: '16px',
      fontFamily: 'Averta',
    },
  },
  firstButton: {
    boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    marginBottom: 15,
  },
  iconSmall: {
    fontSize: 16,
  },
  leftIcon: {
    marginRight: sm,
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
          className={classes.firstButton}
        >
          <Img src={Token} alt="Send funds" className={classNames(classes.leftIcon, classes.iconSmall)} />
          Send funds
        </Button>
        <Button
          color="primary"
          minWidth={260}
          minHeight={52}
          onClick={() => setActiveScreen('sendCustomTx')}
          variant="outlined"
        >
          <Img src={Code} alt="Send custom transaction" className={classNames(classes.leftIcon, classes.iconSmall)} />
          Send custom transaction
        </Button>
      </Col>
    </Row>
  </>
)

export default withStyles(styles)(ChooseTxType)
