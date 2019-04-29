// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Identicon from '~/components/Identicon'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Col from '~/components/layout/Col'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import { lg, sm, secondary } from '~/theme/variables'
import { copyToClipboard } from '~/utils/clipboard'

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
})

const openIconStyle = {
  height: '16px',
  color: secondary,
}

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
}

const Send = ({
  classes, onClose, safeAddress, etherScanLink, safeName,
}: Props) => (
  <React.Fragment>
    <Row align="center" grow className={classes.heading}>
      <Paragraph weight="bolder" className={classes.manage} noMargin>
        Send Funds
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
    <Hairline />
    <Row>
      <Col layout="column" middle="xs">
        <Identicon address={safeAddress} diameter={32} />
      </Col>
      <Col layout="column">
        <Paragraph weight="bolder">{safeName}</Paragraph>
        <Paragraph weight="bolder" onClick={copyToClipboard}>
          {safeAddress}
          <Link to={etherScanLink} target="_blank">
            <OpenInNew style={openIconStyle} />
          </Link>
        </Paragraph>
      </Col>
    </Row>
  </React.Fragment>
)

export default withStyles(styles)(Send)
