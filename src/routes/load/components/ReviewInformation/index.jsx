// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import {
  xs, sm, lg, border, secondary,
} from '~/theme/variables'
import { openAddressInEtherScan, getWeb3 } from '~/logic/wallets/getWeb3'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS } from '~/routes/load/components/fields'
import { sameAddress } from '~/logic/wallets/ethAddresses'
import { getGnosisSafeContract } from '~/logic/contracts/safeContracts'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const styles = () => ({
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  name: {
    letterSpacing: '-0.6px',
  },
  container: {
    marginTop: xs,
    alignItems: 'center',
  },
  address: {
    paddingLeft: '6px',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

type LayoutProps = {
  network: string,
  userAddress: string,
}

type Props = LayoutProps & {
  values: Object,
  classes: Object,
}

type State = {
  isOwner: boolean,
}

class ReviewComponent extends React.PureComponent<Props, State> {
  state = {
    isOwner: false,
  }

  mounted = false

  componentDidMount = async () => {
    this.mounted = true

    const { values, userAddress } = this.props
    const safeAddress = values[FIELD_LOAD_ADDRESS]
    const web3 = getWeb3()

    const GnosisSafe = getGnosisSafeContract(web3)
    const gnosisSafe = await GnosisSafe.at(safeAddress)
    const owners = await gnosisSafe.getOwners()
    if (!owners) {
      return
    }

    const isOwner = owners.find((owner: string) => sameAddress(owner, userAddress)) !== undefined
    if (this.mounted) {
      this.setState(() => ({ isOwner }))
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { values, classes, network } = this.props
    const { isOwner } = this.state

    const safeAddress = values[FIELD_LOAD_ADDRESS]

    return (
      <React.Fragment>
        <Block className={classes.details}>
          <Block margin="lg">
            <Paragraph size="sm" color="disabled" noMargin>
              Name of the Safe
            </Paragraph>
            <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
              {values[FIELD_LOAD_NAME]}
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph size="sm" color="disabled" noMargin>
              Safe address
            </Paragraph>
            <Row className={classes.container}>
              <Identicon address={safeAddress} diameter={32} />
              <Paragraph size="md" color="disabled" noMargin className={classes.address}>{safeAddress}</Paragraph>
              <OpenInNew
                className={classes.open}
                style={openIconStyle}
                onClick={openAddressInEtherScan(safeAddress, network)}
              />
            </Row>
          </Block>
          <Block margin="lg">
            <Paragraph size="sm" color="disabled" noMargin>
              Connected wallet client is owner?
            </Paragraph>
            <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
              { isOwner ? 'Yes' : 'No (read-only)' }
            </Paragraph>
          </Block>
        </Block>
      </React.Fragment>
    )
  }
}

const ReviewPage = withStyles(styles)(ReviewComponent)

const Review = ({ network, userAddress }: LayoutProps) => (controls: React$Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <ReviewPage network={network} values={values} userAddress={userAddress} />
    </OpenPaper>
  </React.Fragment>
)


export default Review
