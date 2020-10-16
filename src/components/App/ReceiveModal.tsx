import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import QRCode from 'qrcode.react'
import React, { ReactElement } from 'react'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { border, fontColor, lg, md, screenSm, secondaryText, sm } from 'src/theme/variables'
import { copyToClipboard } from 'src/utils/clipboard'
import { getNetworkInfo } from 'src/config'

const networkInfo = getNetworkInfo()
const useStyles = makeStyles(
  createStyles({
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
    networkInfo: {
      backgroundColor: `${networkInfo?.backgroundColor ?? border}`,
      color: `${networkInfo?.textColor ?? fontColor}`,
      padding: md,
      marginBottom: 0,
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
  }),
)

type Props = {
  onClose: () => void
  safeAddress: string
  safeName: string
}

const ReceiveModal = ({ onClose, safeAddress, safeName }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl" weight="bolder">
          Receive funds
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Paragraph className={classes.networkInfo} noMargin size="lg" weight="bolder">
        {networkInfo.label} Network only send {networkInfo.label} assets to this Safe.
      </Paragraph>
      <Paragraph className={classes.annotation} noMargin size="lg">
        This is the address of your Safe. Deposit funds by scanning the QR code or copying the address below. Only send{' '}
        {networkInfo.nativeCoin.name} and ERC-20 tokens to this address!
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
          <EtherscanBtn value={safeAddress} />
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

export default ReceiveModal
