// @flow
import * as React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { estimateGasForDeployingSafe } from '~/logic/contracts/safeContracts'
import { getNamesFrom, getAccountsFrom } from '~/routes/open/utils/safeDataExtractor'
import Block from '~/components/layout/Block'
import EtherscanBtn from '~/components/EtherscanBtn'
import CopyBtn from '~/components/CopyBtn'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import {
  sm, md, lg, border, background,
} from '~/theme/variables'
import Hairline from '~/components/layout/Hairline'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { FIELD_NAME, FIELD_CONFIRMATIONS, getNumOwnersFrom } from '../fields'

const { useEffect, useState } = React

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
})

type Props = {
  values: Object,
  classes: Object,
  userAccount: string,
}

const ReviewComponent = ({ values, classes, userAccount }: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  const names = getNamesFrom(values)
  const addresses = getAccountsFrom(values)
  const numOwners = getNumOwnersFrom(values)

  useEffect(() => {
    let isCurrent = true
    const estimateGas = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils
      const estimatedGasCosts = await estimateGasForDeployingSafe(addresses, numOwners, userAccount)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGas()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <>
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
                    <Block justify="center" className={classes.user}>
                      <Paragraph size="md" color="disabled" noMargin>
                        {addresses[index]}
                      </Paragraph>
                      <CopyBtn content={addresses[index]} />
                      <EtherscanBtn type="address" value={addresses[index]} />
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
          You&apos;re about to create a new Safe and will have to confirm a transaction with your currently connected
          wallet. The creation will cost approximately
          {' '}
          {gasCosts}
          {' '}
          ETH. The exact amount will be determined by your
          wallet.
        </Paragraph>
      </Row>
    </>
  )
}

const ReviewPage = withStyles(styles)(ReviewComponent)

const Review = () => (controls: React.Node, { values }: Object) => (
  <>
    <OpenPaper controls={controls} padding={false}>
      <ReviewPage values={values} />
    </OpenPaper>
  </>
)

export default Review
