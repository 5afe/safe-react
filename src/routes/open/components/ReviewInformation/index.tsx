import TableContainer from '@material-ui/core/TableContainer'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getNetworkInfo } from 'src/config'
import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { estimateGasForDeployingSafe } from 'src/logic/contracts/safeContracts'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { getAccountsFrom, getNamesFrom } from 'src/routes/open/utils/safeDataExtractor'

import { FIELD_CONFIRMATIONS, FIELD_NAME, getNumOwnersFrom } from '../fields'
import { useStyles } from './styles'

type ReviewComponentProps = {
  userAccount: string
  values: any
}

const { nativeCoin } = getNetworkInfo()

const ReviewComponent = ({ userAccount, values }: ReviewComponentProps) => {
  const classes = useStyles()

  const [gasCosts, setGasCosts] = useState('< 0.001')
  const names = getNamesFrom(values)
  const addresses = getAccountsFrom(values)
  const numOwners = getNumOwnersFrom(values)

  useEffect(() => {
    const estimateGas = async () => {
      if (!addresses.length || !numOwners || !userAccount) {
        return
      }
      const estimatedGasCosts = (await estimateGasForDeployingSafe(addresses, numOwners, userAccount)).toString()
      const gasCosts = fromTokenUnit(estimatedGasCosts, nativeCoin.decimals)
      const formattedGasCosts = formatAmount(gasCosts)
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
              <Paragraph color="primary" noMargin size="lg" data-testid="create-safe-step-three">
                Details
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Name of new Safe
              </Paragraph>
              <Paragraph
                className={classes.name}
                color="primary"
                noMargin
                size="lg"
                weight="bolder"
                data-testid="create-safe-review-name"
              >
                {values[FIELD_NAME]}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Any transaction requires the confirmation of:
              </Paragraph>
              <Paragraph
                color="primary"
                noMargin
                size="lg"
                weight="bolder"
                data-testid={`create-safe-review-req-owners-${values[FIELD_CONFIRMATIONS]}`}
              >
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
                      <Paragraph noMargin size="lg" data-testid={`create-safe-owner-name-${index}`}>
                        {name}
                      </Paragraph>
                      <Block className={classes.user} justify="center">
                        <Paragraph
                          color="disabled"
                          noMargin
                          size="md"
                          data-testid={`create-safe-owner-address-${index}`}
                        >
                          {addresses[index]}
                        </Paragraph>
                        <CopyBtn content={addresses[index]} />
                        <EtherscanBtn value={addresses[index]} />
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
          wallet. The creation will cost approximately {gasCosts} {nativeCoin.name}. The exact amount will be determined
          by your wallet.
        </Paragraph>
      </Row>
    </>
  )
}

const Review = () =>
  function ReviewPage(controls, props): React.ReactElement {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <ReviewComponent {...props} />
        </OpenPaper>
      </>
    )
  }

export default Review
