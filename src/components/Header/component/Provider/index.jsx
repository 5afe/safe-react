// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import { type Open } from '~/components/hoc/OpenHoc'
import { sm, md } from '~/theme/variables'

import Identicon from '~/components/Identicon'

type Props = Open & {
  provider: string,
  network: string,
  classes: Object,
  userAddress: string,
  connected: boolean,
  children: Function,
}

const styles = () => ({
  root: {
    height: '100%',
    display: 'center',
  },
  provider: {
    padding: `${sm} ${md}`,
    alignItems: 'center',
    flex: '0 1 auto',
    display: 'flex',
    cursor: 'pointer',
  },
  account: {
    padding: `0 ${md} 0 ${sm}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  expand: {
    width: '30px',
    height: '30px',
  },
})

type ProviderRef = { current: null | HTMLDivElement }

class Provider extends React.Component<Props> {
  constructor(props: Props) {
    super(props)

    this.myRef = React.createRef()
  }

  myRef: ProviderRef

  render() {
    const {
      open, toggle, provider, network, userAddress, connected, children, classes,
    } = this.props

    const providerText = connected ? `${provider} [${network}]` : 'Not connected'
    const cutAddress = connected ? `${userAddress.substring(0, 8)}...${userAddress.substring(36)}` : ''

    return (
      <React.Fragment>
        <div ref={this.myRef} className={classes.root}>
          <Col end="sm" middle="xs" className={classes.provider}>
            { connected && <Identicon address={userAddress} diameter={25} /> }
            <Col end="sm" middle="xs" layout="column" className={classes.account}>
              <Paragraph size="sm" transform="capitalize" noMargin bold>{providerText}</Paragraph>
              <Paragraph size="sm" noMargin>{cutAddress}</Paragraph>
            </Col>
            <IconButton
              onClick={toggle}
              disableRipple
              className={classes.expand}
            >
              { open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Col>
        </div>
        { children(this.myRef) }
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Provider)
