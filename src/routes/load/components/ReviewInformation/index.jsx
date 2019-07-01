// @flow
import * as React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import Hairline from '~/components/layout/Hairline'
import {
  xs, sm, lg, border, secondary,
} from '~/theme/variables'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import { getOwnerNameBy, getOwnerAddressBy, getNumOwnersFrom } from '~/routes/open/components/fields'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS, THRESHOLD } from '~/routes/load/components/fields'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const styles = () => ({
  root: {
    minHeight: '300px',
  },
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  owners: {
    padding: lg,
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  userName: {
    whiteSpace: 'nowrap',
  },
  owner: {
    padding: sm,
    paddingLeft: lg,
    alignItems: 'center',
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
  container: {
    marginTop: xs,
    alignItems: 'center',
  },
  address: {
    paddingLeft: '6px',
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

const checkUserAddressOwner = (values: Object, userAddress: string): boolean => {
  let isOwner: boolean = false

  for (let i = 0; i < getNumOwnersFrom(values); i += 1) {
    if (values[getOwnerAddressBy(i)] === userAddress) {
      isOwner = true
      break
    }
  }

  return isOwner
}

class ReviewComponent extends React.PureComponent<Props, State> {
  render() {
    const {
      values, classes, network, userAddress,
    } = this.props

    const isOwner = checkUserAddressOwner(values, userAddress)
    const owners = getAccountsFrom(values)
    const safeAddress = values[FIELD_LOAD_ADDRESS]

    return (
      <React.Fragment>
        <Row className={classes.root}>
          <Col xs={4} layout="column">
            <Block className={classes.details}>
              <Block margin="lg">
                <Paragraph size="lg" color="primary" noMargin>
                Review details
                </Paragraph>
              </Block>
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
                  <Paragraph size="md" color="disabled" noMargin className={classes.address}>
                    {shortVersionOf(safeAddress, 4)}
                  </Paragraph>
                  <Link className={classes.open} to={getEtherScanLink(safeAddress, network)} target="_blank">
                    <OpenInNew style={openIconStyle} />
                  </Link>
                </Row>
              </Block>
              <Block margin="lg">
                <Paragraph size="sm" color="disabled" noMargin>
                Connected wallet client is owner?
                </Paragraph>
                <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
                  {isOwner ? 'Yes' : 'No (read-only)'}
                </Paragraph>
              </Block>
              <Block margin="lg">
                <Paragraph size="sm" color="disabled" noMargin>
                Any transaction requires the confirmation of:
                </Paragraph>
                <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
                  {`${values[THRESHOLD]} out of ${getNumOwnersFrom(values)} owners`}
                </Paragraph>
              </Block>
            </Block>
          </Col>
          <Col xs={8} layout="column">
            <Block className={classes.owners}>
              <Paragraph size="lg" color="primary" noMargin>
                {`${getNumOwnersFrom(values)} Safe owners`}
              </Paragraph>
            </Block>
            <Hairline />
            {owners.map((x, index) => (
              <React.Fragment key={owners[index].address}>
                <Row className={classes.owner}>
                  <Col xs={1} align="center">
                    <Identicon address={owners[index]} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph size="lg" noMargin>
                        {values[getOwnerNameBy(index)]}
                      </Paragraph>
                      <Block align="center" className={classes.user}>
                        <Paragraph size="md" color="disabled" noMargin>
                          {owners[index]}
                        </Paragraph>
                        <Link className={classes.open} to={getEtherScanLink(owners[index], network)} target="_blank">
                          <OpenInNew style={openIconStyle} />
                        </Link>
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Hairline />
              </React.Fragment>
            ))}
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const ReviewPage = withStyles(styles)(ReviewComponent)

const Review = ({ network, userAddress }: LayoutProps) => (controls: React.Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <ReviewPage network={network} values={values} userAddress={userAddress} />
    </OpenPaper>
  </React.Fragment>
)

export default Review
