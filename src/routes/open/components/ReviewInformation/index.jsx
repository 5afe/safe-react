// @flow
import * as React from 'react'
import classNames from 'classnames'
import { getNamesFrom, getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Block from '~/components/layout/Block'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import {
  sm, md, lg, border, secondary, background,
} from '~/theme/variables'
import Hairline from '~/components/layout/Hairline'
import { openAddressInEtherScan } from '~/logic/wallets/getWeb3'
import { FIELD_NAME, FIELD_CONFIRMATIONS, getNumOwnersFrom } from '../fields'

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
  info: {
    backgroundColor: background,
    padding: lg,
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
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
    padding: md,
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
})

type LayoutProps = {
  network: string,
}

type Props = LayoutProps & {
  values: Object,
  classes: Object,
}

const ReviewComponent = ({ values, classes, network }: Props) => {
  const names = getNamesFrom(values)
  const addresses = getAccountsFrom(values)
  const numOwners = getNumOwnersFrom(values)

  return (
    <React.Fragment>
      <Row className={classes.root}>
        <Col xs={4} layout="column">
          <Block className={classes.details}>
            <Block margin="lg">
              <Paragraph size="lg" color="primary" noMargin>
                Details
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph size="sm" color="disabled" noMargin>
                Name of new Safe
              </Paragraph>
              <Paragraph size="lg" color="primary" noMargin weight="bolder" className={classes.name}>
                {values[FIELD_NAME]}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph size="sm" color="disabled" noMargin>
                Any transaction requires the confirmation of:
              </Paragraph>
              <Paragraph size="lg" color="primary" noMargin weight="bolder">
                {`${values[FIELD_CONFIRMATIONS]} out of ${numOwners} owners`}
              </Paragraph>
            </Block>
          </Block>
        </Col>
        <Col xs={8} layout="column">
          <Block className={classes.owners}>
            <Paragraph size="lg" color="primary" noMargin>
              {`${numOwners} Safe owners`}
            </Paragraph>
          </Block>
          <Hairline />
          {names.map((name, index) => (
            <React.Fragment key={`name${index}`}>
              <Row className={classes.owner}>
                <Col xs={1} align="center">
                  <Identicon address={addresses[index]} diameter={32} />
                </Col>
                <Col xs={11}>
                  <Block className={classNames(classes.name, classes.userName)}>
                    <Paragraph size="lg" noMargin>
                      {name}
                    </Paragraph>
                    <Block align="center" className={classes.user}>
                      <Paragraph size="md" color="disabled" noMargin>
                        {addresses[index]}
                      </Paragraph>
                      <OpenInNew
                        className={classes.open}
                        style={openIconStyle}
                        onClick={openAddressInEtherScan(addresses[index], network)}
                      />
                    </Block>
                  </Block>
                </Col>
              </Row>
              <Hairline />
            </React.Fragment>
          ))}
        </Col>
      </Row>
      <Row className={classes.info} align="center">
        <Paragraph noMargin color="primary" size="md">
          {"You're about to create a new Safe."}
        </Paragraph>
        <Paragraph noMargin color="primary" size="md">
          Make sure you have enough ETH in your wallet client to fund this transaction.
        </Paragraph>
      </Row>
    </React.Fragment>
  )
}

const ReviewPage = withStyles(styles)(ReviewComponent)

const Review = ({ network }: LayoutProps) => (controls: React$Node, { values }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} padding={false}>
      <ReviewPage network={network} values={values} />
    </OpenPaper>
  </React.Fragment>
)

export default Review
