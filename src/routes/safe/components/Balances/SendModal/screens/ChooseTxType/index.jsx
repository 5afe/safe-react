// @flow
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames/bind'
import * as React from 'react'

import Code from '../assets/code.svg'
import Collectible from '../assets/collectibles.svg'
import Token from '../assets/token.svg'

import { SafeVersionContext } from '~/components/SafeVersionProvider'
import { mustBeEthereumContractAddress } from '~/components/forms/validator'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { lg, md, sm } from '~/theme/variables'

const useStyles = makeStyles({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  manage: {
    fontSize: lg,
  },
  disclaimer: {
    marginBottom: `-${md}`,
    paddingTop: md,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: md,
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
  recipientAddress?: string,
  setActiveScreen: Function,
}

const ChooseTxType = ({ onClose, recipientAddress, setActiveScreen }: Props) => {
  const classes = useStyles()
  const { featuresEnabled } = React.useContext(SafeVersionContext)
  const erc721Enabled = featuresEnabled.includes('ERC721')
  const [disableCustomTx, setDisableCustomTx] = React.useState(!!recipientAddress)

  React.useEffect(() => {
    let isCurrent = true
    const isContract = async () => {
      if (recipientAddress && isCurrent) {
        setDisableCustomTx(!!(await mustBeEthereumContractAddress(recipientAddress)))
      }
    }

    isContract()

    return () => {
      isCurrent = false
    }
  }, [recipientAddress])

  return (
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
      {!!recipientAddress && (
        <Row align="center">
          <Col className={classes.disclaimer} layout="column" middle="xs">
            <Paragraph className={classes.disclaimerText} noMargin>
              Please select what you will send to {recipientAddress}
            </Paragraph>
          </Col>
        </Row>
      )}
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
          {erc721Enabled && (
            <Button
              className={classes.firstButton}
              color="primary"
              minHeight={52}
              minWidth={260}
              onClick={() => setActiveScreen('sendCollectible')}
              variant="contained"
            >
              <Img
                alt="Send collectible"
                className={classNames(classes.leftIcon, classes.iconSmall)}
                src={Collectible}
              />
              Send collectible
            </Button>
          )}
          <Button
            color="primary"
            disabled={disableCustomTx}
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
}

export default ChooseTxType
