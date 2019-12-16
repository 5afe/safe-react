// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import QRCode from 'qrcode.react'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Hairline from '~/components/layout/Hairline'
import Col from '~/components/layout/Col'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import {
  sm, lg, md, secondaryText,
} from '~/theme/variables'
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
    margin: `${lg} 0`,
  },
  address: {
    marginLeft: sm,
    marginRight: sm,
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
  safeName: string,
  safeAddress: string,
}

const Receive = ({
  classes, onClose, safeAddress, safeName,
}: Props) => (
  <>
    <Row align="center" grow className={classes.heading}>
      <Paragraph className={classes.manage} size="xl" weight="bolder" noMargin>
        Receive funds
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.close} />
      </IconButton>
    </Row>
    <Hairline />
    <Paragraph className={classes.annotation} size="lg" noMargin>
      This is the address of your Safe. Deposit funds by scanning the QR code or copying the address below. Only send
      ETH and ERC-20 tokens to this address!
    </Paragraph>
    <Col layout="column" middle="xs">
      <Paragraph className={classes.safeName} weight="bold" size="lg" noMargin>
        {safeName}
      </Paragraph>
      <Block className={classes.qrContainer}>
        <QRCode value={safeAddress} size={135} />
      </Block>
      <Block justify="center" className={classes.addressContainer}>
        <Identicon address={safeAddress} diameter={32} />
        <Paragraph
          onClick={() => {
            copyToClipboard(safeAddress)
          }}
          className={classes.address}
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

export default withStyles(styles)(Receive)
