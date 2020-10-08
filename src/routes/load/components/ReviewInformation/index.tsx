import TableContainer from '@material-ui/core/TableContainer'
import classNames from 'classnames'
import React from 'react'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'
import { FIELD_LOAD_ADDRESS, FIELD_LOAD_NAME, THRESHOLD } from 'src/routes/load/components/fields'
import { getNumOwnersFrom, getOwnerAddressBy, getOwnerNameBy } from 'src/routes/open/components/fields'
import { getAccountsFrom } from 'src/routes/open/utils/safeDataExtractor'
import { useStyles } from './styles'

const checkIfUserAddressIsAnOwner = (values: Record<string, string>, userAddress: string): boolean => {
  let isOwner = false

  for (let i = 0; i < getNumOwnersFrom(values); i += 1) {
    if (values[getOwnerAddressBy(i)] === userAddress) {
      isOwner = true
      break
    }
  }

  return isOwner
}

interface Props {
  userAddress: string
  values: Record<string, string>
}

const ReviewComponent = ({ userAddress, values }: Props): React.ReactElement => {
  const classes = useStyles()
  const isOwner = checkIfUserAddressIsAnOwner(values, userAddress)
  const owners = getAccountsFrom(values)
  const safeAddress = values[FIELD_LOAD_ADDRESS]

  return (
    <>
      <Row className={classes.root}>
        <Col className={classes.detailsColumn} layout="column" xs={4}>
          <Block className={classes.details}>
            <Block margin="lg">
              <Paragraph color="primary" noMargin size="lg" data-testid="load-safe-step-three">
                Review details
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Name of the Safe
              </Paragraph>
              <Paragraph
                className={classes.name}
                color="primary"
                noMargin
                size="lg"
                weight="bolder"
                data-testid="load-form-review-safe-name"
              >
                {values[FIELD_LOAD_NAME]}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Safe address
              </Paragraph>
              <Row className={classes.container}>
                <Identicon address={safeAddress} diameter={32} />
                <Paragraph className={classes.address} color="disabled" noMargin size="md">
                  {shortVersionOf(safeAddress, 4)}
                </Paragraph>
                <CopyBtn content={safeAddress} />
                <EtherscanBtn value={safeAddress} />
              </Row>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Connected wallet client is owner?
              </Paragraph>
              <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                {isOwner ? 'Yes' : 'No (read-only)'}
              </Paragraph>
            </Block>
            <Block margin="lg">
              <Paragraph color="disabled" noMargin size="sm">
                Any transaction requires the confirmation of:
              </Paragraph>
              <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
                {`${values[THRESHOLD]} out of ${getNumOwnersFrom(values)} owners`}
              </Paragraph>
            </Block>
          </Block>
        </Col>
        <Col className={classes.ownersColumn} layout="column" xs={8}>
          <TableContainer>
            <Block className={classes.owners}>
              <Paragraph color="primary" noMargin size="lg">
                {`${getNumOwnersFrom(values)} Safe owners`}
              </Paragraph>
            </Block>
            <Hairline />
            {owners.map((address, index) => (
              <>
                <Row className={classes.owner}>
                  <Col align="center" xs={1}>
                    <Identicon address={address} diameter={32} />
                  </Col>
                  <Col xs={11}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph noMargin size="lg" data-testid="load-safe-review-owner-name">
                        {values[getOwnerNameBy(index)]}
                      </Paragraph>
                      <Block className={classes.user} justify="center">
                        <Paragraph color="disabled" noMargin size="md">
                          {address}
                        </Paragraph>
                        <CopyBtn content={address} />
                        <EtherscanBtn value={address} />
                      </Block>
                    </Block>
                  </Col>
                </Row>
                {index !== owners.length - 1 && <Hairline />}
              </>
            ))}
          </TableContainer>
        </Col>
      </Row>
    </>
  )
}

const Review = ({ userAddress }: { userAddress: string }) =>
  function ReviewPage(controls: React.ReactNode, { values }: { values: Record<string, string> }): React.ReactElement {
    return (
      <>
        <OpenPaper controls={controls} padding={false}>
          <ReviewComponent userAddress={userAddress} values={values} />
        </OpenPaper>
      </>
    )
  }

export default Review
