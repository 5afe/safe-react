// @flow
import * as React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import EtherscanBtn from '~/components/EtherscanBtn'
import Paragraph from '~/components/layout/Paragraph'
import CopyBtn from '~/components/CopyBtn'
import Hairline from '~/components/layout/Hairline'
import {
  xs, sm, lg, border,
} from '~/theme/variables'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import { getOwnerNameBy, getOwnerAddressBy, getNumOwnersFrom } from '~/routes/open/components/fields'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS, THRESHOLD } from '~/routes/load/components/fields'
import type { LayoutProps } from '../Layout'

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
    '& > p': {
      marginRight: sm,
    },
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
    marginRight: sm,
  },
})

type Props = {
  userAddress: string,
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
    const { values, classes, userAddress } = this.props

    const isOwner = checkUserAddressOwner(values, userAddress)
    const owners = getAccountsFrom(values)
    const safeAddress = values[FIELD_LOAD_ADDRESS]

    return (
      <>
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
                  <CopyBtn content={safeAddress} />
                  <EtherscanBtn type="address" value={safeAddress} />
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
            {owners.map((address, index) => (
              <React.Fragment key={address}>
                <Row className={classes.owner}>
                  <Col xs={1} align="center">
                    <Identicon address={address} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph size="lg" noMargin>
                        {values[getOwnerNameBy(index)]}
                      </Paragraph>
                      <Block justify="center" className={classes.user}>
                        <Paragraph size="md" color="disabled" noMargin>
                          {address}
                        </Paragraph>
                        <CopyBtn content={address} />
                        <EtherscanBtn type="address" value={address} />
                      </Block>
                    </Block>
                  </Col>
                </Row>
                {index !== owners.length - 1 && <Hairline />}
              </React.Fragment>
            ))}
          </Col>
        </Row>
      </>
    )
  }
}

const ReviewPage = withStyles(styles)(ReviewComponent)

const Review = ({ network, userAddress }: LayoutProps) => (controls: React.Node, { values }: Object) => (
  <>
    <OpenPaper controls={controls} padding={false}>
      <ReviewPage network={network} values={values} userAddress={userAddress} />
    </OpenPaper>
  </>
)

export default Review
