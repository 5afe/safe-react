// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames/bind'
import * as React from 'react'

import Code from '../assets/code.svg'
import Token from '../assets/token.svg'

import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { lg, md, sm } from '~/theme/variables'

const styles = () => ({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  manage: {
    fontSize: lg,
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  buttonColumn: {
    padding: '52px 0',
    '& > button': {
      fontSize: md,
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
    <Row align="center" className={classes.heading} grow>
      <Paragraph className={classes.manage} noMargin weight="bolder">
        Send
      </Paragraph>
      <IconButton disableRipple onClick={onClose}>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
    <Hairline />
    <Row align="center">
      <Col className={classes.buttonColumn} layout="column" middle="xs">
        <Button
          className={classes.firstButton}
          color="primary"
          minHeight={52}
          minWidth={260}
          onClick={() => setActiveScreen('sendFunds')}
          variant="contained"
        >
          <Img alt="Send funds" className={classNames(classes.leftIcon, classes.iconSmall)} src={Token} />
          Send funds
        </Button>
        <Button
          color="primary"
          minHeight={52}
          minWidth={260}
          onClick={() => setActiveScreen('sendCustomTx')}
          variant="outlined"
        >
          <Img alt="Send custom transaction" className={classNames(classes.leftIcon, classes.iconSmall)} src={Code} />
          Send custom transaction
        </Button>
      </Col>
    </Row>
  </>
)

export default withStyles(styles)(ChooseTxType)
