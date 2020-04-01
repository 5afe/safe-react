// @flow
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import QRCode from 'qrcode.react'
import * as React from 'react'
import { useSelector } from 'react-redux'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { safeNameSelector, safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import { lg, md, screenSm, secondaryText, sm } from '~/theme/variables'
import { copyToClipboard } from '~/utils/clipboard'

const styles = () => ({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  close: {
    height: lg,
    width: lg,
    fill: secondaryText,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: md,
    borderRadius: '6px',
    border: `1px solid ${secondaryText}`,
  },
  annotation: {
    margin: lg,
    marginBottom: 0,
  },
  safeName: {
    margin: `${md} 0`,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    '& > button': {
      fontFamily: 'Averta',
      fontSize: md,
      boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    },
  },
  addressContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    margin: `${lg} 0`,

    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  address: {
    marginLeft: sm,
    marginRight: sm,
    maxWidth: '70%',
    overflowWrap: 'break-word',

    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
    },
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
}

const Receive = ({ classes, onClose }: Props) => {
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const safeName = useSelector(safeNameSelector)
  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin size="xl" weight="bolder">
          Receive funds
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Paragraph className={classes.annotation} noMargin size="lg">
        This is the address of your Safe. Deposit funds by scanning the QR code or copying the address below. Only send
        ETH and ERC-20 tokens to this address!
      </Paragraph>
      <Col layout="column" middle="xs">
        <Paragraph className={classes.safeName} noMargin size="lg" weight="bold">
          {safeName}
        </Paragraph>
        <Block className={classes.qrContainer}>
          <QRCode size={135} value={safeAddress} />
        </Block>
        <Block className={classes.addressContainer} justify="center">
          <Identicon address={safeAddress} diameter={32} />
          <Paragraph
            className={classes.address}
            onClick={() => {
              copyToClipboard(safeAddress)
            }}
          >
            {safeAddress}
          </Paragraph>
          <CopyBtn content={safeAddress} />
          <EtherscanBtn type="address" value={safeAddress} />
        </Block>
      </Col>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button color="primary" minWidth={130} onClick={onClose} variant="contained">
          Done
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(Receive)
