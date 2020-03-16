// @flow
import TableContainer from '@material-ui/core/TableContainer'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import * as React from 'react'

import { FIELD_CONFIRMATIONS, FIELD_NAME, getNumOwnersFrom } from '../fields'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import Identicon from '~/components/Identicon'
import OpenPaper from '~/components/Stepper/OpenPaper'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { estimateGasForDeployingSafe } from '~/logic/contracts/safeContracts'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getAccountsFrom, getNamesFrom } from '~/routes/open/utils/safeDataExtractor'
import { background, border, lg, screenSm, sm } from '~/theme/variables'

const { useEffect, useState } = React

const styles = () => ({
  root: {
    minHeight: '300px',
    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  detailsColumn: {
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '0',
    },
  },
  ownersColumn: {
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '0',
    },
  },
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  info: {
    backgroundColor: background,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: lg,
    textAlign: 'center',
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
    alignItems: 'center',
    minWidth: 'fit-content',
    padding: sm,
    paddingLeft: lg,
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

const ReviewComponent = ({ classes, userAccount, values }: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')
  const names = getNamesFrom(values)
  const addresses = getAccountsFrom(values)
  const numOwners = getNumOwnersFrom(values)

  useEffect(() => {
    const estimateGas = async () => {
      if (!addresses.length || !numOwners || !userAccount) {
        return
      }
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils
      const estimatedGasCosts = await estimateGasForDeployingSafe(addresses, numOwners, userAccount)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      setGasCosts(formattedGasCosts)
    }

    estimateGas()
  }, [addresses, numOwners, userAccount])

  return (
    <>
      <Row className={classes.root}>
        <Col className={classes.detailsColumn} layout="column" xs={4}>
          <Block className={classes.details}>
            <Block margin="lg">
              <Paragraph color="primary" noMargin size="lg">
                Details
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Name of new Safe
              </Paragraph>
              <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                {values[FIELD_NAME]}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Any transaction requires the confirmation of:
              </Paragraph>
              <Paragraph color="primary" noMargin size="lg" weight="bolder">
                {`${values[FIELD_CONFIRMATIONS]} out of ${numOwners} owners`}
              </Paragraph>
            </Block>
          </Block>
        </Col>
        <Col className={classes.ownersColumn} layout="column" xs={8}>
          <TableContainer>
            <Block className={classes.owners}>
              <Paragraph color="primary" noMargin size="lg">
                {`${numOwners} Safe owners`}
              </Paragraph>
            </Block>
            <Hairline />
            {names.map((name, index) => (
              <React.Fragment key={`name${index}`}>
                <Row className={classes.owner}>
                  <Col align="center" xs={1}>
                    <Identicon address={addresses[index]} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph noMargin size="lg">
                        {name}
                      </Paragraph>
                      <Block className={classes.user} justify="center">
                        <Paragraph color="disabled" noMargin size="md">
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
          </TableContainer>
        </Col>
      </Row>
      <Row align="center" className={classes.info}>
        <Paragraph color="primary" noMargin size="md">
          You&apos;re about to create a new Safe and will have to confirm a transaction with your currently connected
          wallet. The creation will cost approximately {gasCosts} ETH. The exact amount will be determined by your
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
