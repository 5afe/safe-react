// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Hairline from '~/components/layout/Hairline'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import { withStyles } from '@material-ui/core/styles'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import NoSafe from '~/components/NoSafe'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { openAddressInEtherScan } from '~/logic/wallets/getWeb3'
import { sm, secondary } from '~/theme/variables'
import Balances from './Balances'

type Props = SelectorProps & {
  classes: Object,
}

type State = {
  value: number,
}

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: sm,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  user: {
    justifyContent: 'left',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

class Layout extends React.Component<Props, State> {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const {
      safe, provider, network, classes,
    } = this.props
    const { value } = this.state

    if (!safe) {
      return <NoSafe provider={provider} text="Not found safe" />
    }
    // <GnoSafe safe={safe} tokens={activeTokens} userAddress={userAddress} />
    const address = safe.get('address')

    return (
      <React.Fragment>
        <Block className={classes.container} margin="xl">
          <Identicon address={address} diameter={50} />
          <Block className={classes.name}>
            <Heading tag="h2" color="secondary">{safe.get('name')}</Heading>
            <Block align="center" className={classes.user}>
              <Paragraph size="md" color="disabled" noMargin>{address}</Paragraph>
              <OpenInNew
                className={classes.open}
                style={openIconStyle}
                onClick={openAddressInEtherScan(address, network)}
              />
            </Block>
          </Block>
        </Block>
        <Row>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
          >
            <Tab label="Balances" />
            <Tab label="Transactions" />
            <Tab label="Settings" />
          </Tabs>
        </Row>
        <Hairline color="#c8ced4" />
        {value === 0 && <Balances />}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Layout)
