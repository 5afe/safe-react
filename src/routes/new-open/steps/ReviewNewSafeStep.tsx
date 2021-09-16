import React, { ReactElement, useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import TableContainer from '@material-ui/core/TableContainer'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { background, border, lg, sm } from 'src/theme/variables'
import {
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_NEW_SAFE_GAS_LIMIT,
  FIELD_NEW_SAFE_PROXY_SALT,
  FIELD_NEW_SAFE_THRESHOLD,
  FIELD_SAFE_OWNERS_LIST,
} from '../fields/createSafeFields'
import { useForm } from 'react-final-form'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import { useEstimateSafeCreationGas } from 'src/logic/hooks/useEstimateSafeCreationGas'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'

export const reviewNewSafeStepLabel = 'Review'

function ReviewNewSafeStep(): ReactElement {
  const classes = useStyles()

  const createSafeForm = useForm()
  const createSafeFormValues = createSafeForm.getState().values

  const defaultSafeValue = createSafeFormValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]
  const safeName = createSafeFormValues[FIELD_CREATE_CUSTOM_SAFE_NAME] || defaultSafeValue
  const threshold = createSafeFormValues[FIELD_NEW_SAFE_THRESHOLD]
  const owners = createSafeFormValues[FIELD_SAFE_OWNERS_LIST]
  const numberOfOwners = owners.length
  const safeCreationSalt = createSafeFormValues[FIELD_NEW_SAFE_PROXY_SALT]
  const ownerAddresses = owners.map(({ addressFieldName }) => createSafeFormValues[addressFieldName])

  const { gasCostFormatted, gasLimit } = useEstimateSafeCreationGas({
    addresses: ownerAddresses,
    numOwners: numberOfOwners,
    safeCreationSalt,
  })
  const { nativeCoin } = getNetworkInfo()

  useEffect(() => {
    createSafeForm.change(FIELD_NEW_SAFE_GAS_LIMIT, gasLimit)
  }, [gasLimit, createSafeForm])

  return (
    <Row className={classes.root} data-testid={'create-new-safe-review-step'}>
      <Col xs={4} layout="column">
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
            <Paragraph
              className={classes.safeName}
              color="primary"
              noMargin
              size="md"
              weight="bolder"
              data-testid="create-new-safe-review-safe-name"
            >
              {safeName}
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Any transaction requires the confirmation of:
            </Paragraph>
            <Paragraph
              color="primary"
              noMargin
              size="md"
              weight="bolder"
              data-testid={'create-new-safe-review-threshold-label'}
            >
              {`${threshold} out of ${numberOfOwners} owners`}
            </Paragraph>
          </Block>
        </Block>
      </Col>
      <Col layout="column" xs={8}>
        <TableContainer>
          <Block className={classes.ownersTitleLabel}>
            <Paragraph color="primary" noMargin size="lg">
              {`${numberOfOwners} Safe owners`}
            </Paragraph>
          </Block>
          <Hairline />
          {owners.map(({ nameFieldName, addressFieldName }) => {
            const ownerName = createSafeFormValues[nameFieldName]
            const ownerAddress = createSafeFormValues[addressFieldName]
            return (
              <React.Fragment key={`owner-${addressFieldName}`}>
                <Row className={classes.ownersLabel}>
                  <Col align="center" xs={12} data-testid={`create-new-safe-owner-details-${ownerAddress}`}>
                    <EthHashInfo
                      hash={ownerAddress}
                      name={ownerName}
                      showAvatar
                      showCopyBtn
                      explorerUrl={getExplorerInfo(ownerAddress)}
                    />
                  </Col>
                </Row>
                <Hairline />
              </React.Fragment>
            )
          })}
        </TableContainer>
      </Col>
      <Row align="center" className={classes.descriptionContainer}>
        <Paragraph color="primary" noMargin size="lg">
          You&apos;re about to create a new Safe on <NetworkLabel /> and will have to confirm a transaction with your
          currently connected wallet. The creation will cost approximately {gasCostFormatted} {nativeCoin.name}. The
          exact amount will be determined by your wallet.
        </Paragraph>
      </Row>
    </Row>
  )
}

export default ReviewNewSafeStep

const useStyles = makeStyles({
  root: {
    minHeight: '300px',
  },
  details: {
    padding: lg,
    borderRight: `solid 1px ${border}`,
    height: '100%',
  },
  safeName: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  ownersTitleLabel: {
    padding: lg,
  },
  ownersLabel: {
    alignItems: 'center',
    minWidth: 'fit-content',
    padding: sm,
    paddingLeft: lg,
  },
  descriptionContainer: {
    backgroundColor: background,
    padding: lg,
    textAlign: 'center',
  },
})
