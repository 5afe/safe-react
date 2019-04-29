// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Link from '~/components/layout/Link'
import QRCode from 'qrcode.react'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Hairline from '~/components/layout/Hairline'
import Col from '~/components/layout/Col'
import {
  xxl, lg, sm, md, background, secondary,
} from '~/theme/variables'
import { copyToClipboard } from '~/utils/clipboard'

const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
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
  detailsContainer: {
    backgroundColor: background,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: md,
    borderRadius: '3px',
    boxShadow: '0 0 5px 0 rgba(74, 85, 121, 0.5)',
  },
  safeName: {
    margin: `${xxl} 0 20px`,
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
  },
  button: {
    height: '42px',
  },
  addressContainer: {
    marginTop: '28px',
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
  <React.Fragment>
    <Row align="center" grow className={classes.heading}>
      <Paragraph className={classes.manage} weight="bolder" noMargin>
        Receive funds
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.close} />
      </IconButton>
    </Row>
    <Col layout="column" middle="xs" className={classes.detailsContainer}>
      <Hairline />
      <Paragraph className={classes.safeName} weight="bolder" size="xl" noMargin>
        {safeName}
      </Paragraph>
      <Block className={classes.qrContainer}>
        <QRCode value={safeAddress} size={135} />
      </Block>
      <Block align="center" className={classes.addressContainer}>
        <Identicon address={safeAddress} diameter={32} />
        <Paragraph onClick={copyToClipboard} className={classes.address}>{safeAddress}</Paragraph>
        <Link className={classes.open} to={etherScanLink} target="_blank">
          <OpenInNew style={openIconStyle} />
        </Link>
      </Block>
    </Col>
    <Hairline />
    <Row align="center" className={classes.buttonRow}>
      <Button color="primary" className={classes.button} minWidth={140} onClick={onClose} variant="contained">
        Done
      </Button>
    </Row>
  </React.Fragment>
)

export default withStyles(styles)(Receive)
