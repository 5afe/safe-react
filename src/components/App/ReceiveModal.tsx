import { Button, Switch } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import QRCode from 'qrcode.react'
import { ReactElement, useState } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import { useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from '../PrefixedEthHashInfo'
import { border, fontColor, lg, md, screenSm, secondaryText } from 'src/theme/variables'
import { getChainInfo, getExplorerInfo } from 'src/config'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { copyShortNameSelector } from 'src/logic/appearance/selectors'
import { getPrefixedSafeAddressSlug } from 'src/routes/routes'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

const useStyles = (chainInfo: ChainInfo) =>
  makeStyles(
    createStyles({
      heading: {
        padding: `${md} ${lg}`,
        justifyContent: 'space-between',
        height: '74px',
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
        backgroundColor: `${chainInfo?.theme?.backgroundColor ?? border}`,
        color: `${chainInfo?.theme?.textColor ?? fontColor}`,
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
    }),
  )()

export const RECEIVE_ASSETS_MODAL_TEST_ID = 'receive-assets-modal'

type Props = {
  onClose: () => void
  safeAddress: string
  safeName: string
}

const ReceiveModal = ({ onClose, safeAddress, safeName }: Props): ReactElement => {
  const chainInfo = getChainInfo()
  const classes = useStyles(chainInfo)
  const { shortName } = useSafeAddress()

  const copyShortName = useSelector(copyShortNameSelector)
  const [shouldEncodePrefix, setShouldEncodePrefix] = useState<boolean>(copyShortName)

  const qrCodeString = shouldEncodePrefix ? getPrefixedSafeAddressSlug({ shortName, safeAddress }) : safeAddress

  return (
    <div data-testid={RECEIVE_ASSETS_MODAL_TEST_ID}>
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl" weight="bolder">
          Receive assets
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Paragraph className={classes.networkInfo} noMargin size="lg" weight="bolder">
        {chainInfo.chainName} Network–only send {chainInfo.chainName} assets to this Safe.
      </Paragraph>
      <Paragraph className={classes.annotation} noMargin size="lg">
        This is the address of your Safe. Deposit funds by scanning the QR code or copying the address below. Only send{' '}
        {chainInfo.nativeCurrency.symbol} and assets to this address (e.g. ETH, ERC20, ERC721)!
      </Paragraph>
      <Col layout="column" middle="xs">
        <Paragraph className={classes.safeName} noMargin size="lg" weight="bold">
          {safeName}
        </Paragraph>
        <Block className={classes.qrContainer}>
          <QRCode size={135} value={qrCodeString} />
        </Block>
        <FormControlLabel
          control={<Switch checked={shouldEncodePrefix} onChange={setShouldEncodePrefix} />}
          label={
            <>
              QR code with chain prefix (<b>{shortName}:</b>)
            </>
          }
        />
        <Block className={classes.addressContainer} justify="center">
          <PrefixedEthHashInfo hash={safeAddress} showAvatar showCopyBtn explorerUrl={getExplorerInfo(safeAddress)} />
        </Block>
      </Col>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button size="md" color="primary" onClick={onClose} variant="contained">
          Done
        </Button>
      </Row>
    </div>
  )
}

export default ReceiveModal
