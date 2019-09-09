// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import QRCode from 'qrcode.react'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Hairline from '~/components/layout/Hairline'
import Col from '~/components/layout/Col'
import {
  lg, md, secondary, secondaryText,
} from '~/theme/variables'
import { copyToClipboard } from '~/utils/clipboard'

const styles = () => ({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
  manage: {
    fontSize: '24px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: md,
    borderRadius: '6px',
    border: `1px solid ${secondaryText}`,
  },
  safeName: {
    margin: `${lg} 0 ${lg}`,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    '& > button': {
      fontFamily: 'Averta',
      fontSize: '16px',
      boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    },
  },
  addressContainer: {
    marginTop: '25px',
    marginBottom: '25px',
  },
  address: {
    marginLeft: '6px',
  },
})

const openIconStyle = {
  height: '16px',
  color: secondary,
}

type Props = {
  onClose: () => void,
  classes: Object,
  safeName: string,
  safeAddress: string,
  etherScanLink: string,
}

const Receive = ({
  classes, onClose, safeAddress, safeName, etherScanLink,
}: Props) => (
  <>
    <Row align="center" grow className={classes.heading}>
      <Paragraph className={classes.manage} weight="bolder" noMargin>
        Receive funds
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.close} />
      </IconButton>
    </Row>
    <Col layout="column" middle="xs">
      <Hairline />
      <Paragraph className={classes.safeName} weight="bolder" size="xl" noMargin>
        {safeName}
      </Paragraph>
      <Block className={classes.qrContainer}>
        <QRCode value={safeAddress} size={135} />
      </Block>
      <Block align="center" className={classes.addressContainer}>
        <Identicon address={safeAddress} diameter={32} />
        <Paragraph
          onClick={() => {
            copyToClipboard(safeAddress)
          }}
          className={classes.address}
        >
          {safeAddress}
        </Paragraph>
        <Link className={classes.open} to={etherScanLink} target="_blank">
          <OpenInNew style={openIconStyle} />
        </Link>
      </Block>
    </Col>
    <Hairline />
    <Row align="center" className={classes.buttonRow}>
      <Button color="primary" minHeight={35} minWidth={140} onClick={onClose} variant="contained">
        Done
      </Button>
    </Row>
  </>
)

export default withStyles(styles)(Receive)
