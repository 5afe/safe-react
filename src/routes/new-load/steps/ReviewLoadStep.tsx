import React, { Fragment, ReactElement } from 'react'
import { makeStyles, TableContainer } from '@material-ui/core'
import Block from 'src/components/layout/Block'
import { border, lg, screenSm, sm, xs } from 'src/theme/variables'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { useForm } from 'react-final-form'
// TODO: MOVE FIELD CONSTANT TO A FILE fields.js
import {
  FIELD_LOAD_CUSTOM_SAFE_NAME,
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_LOAD_SUGGESTED_SAFE_NAME,
} from './LoadSafeAddressStep'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { getExplorerInfo } from 'src/config'
import { useSelector } from 'react-redux'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { FIELD_SAFE_OWNER_LIST } from './LoadSafeOwnersStep'
import Hairline from 'src/components/layout/Hairline'

export const reviewLoadStepLabel = 'Review'

export const FIELD_SAFE_THRESHOLD = 'safeThreshold'

function ReviewLoadStep(): ReactElement {
  const classes = useStyles()

  const loadSafeForm = useForm()
  const userAddress = useSelector(userAccountSelector)

  const formValues = loadSafeForm.getState().values

  const safeName = formValues[FIELD_LOAD_CUSTOM_SAFE_NAME] || formValues[FIELD_LOAD_SUGGESTED_SAFE_NAME]
  const safeAddress = formValues[FIELD_LOAD_SAFE_ADDRESS]
  const threshold = formValues[FIELD_SAFE_THRESHOLD]
  const ownerList = formValues[FIELD_SAFE_OWNER_LIST]

  const isUserConnectedWalletASAfeOwner = checkIfUserAddressIsAnOwner(ownerList, userAddress)

  return (
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
              {safeName}
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Safe address
            </Paragraph>
            <Row className={classes.container}>
              <EthHashInfo
                hash={safeAddress}
                shortenHash={4}
                showAvatar
                showCopyBtn
                explorerUrl={getExplorerInfo(safeAddress)}
              />
            </Row>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Connected wallet client is owner?
            </Paragraph>
            <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
              {isUserConnectedWalletASAfeOwner ? 'Yes' : 'No (read-only)'}
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Any transaction requires the confirmation of:
            </Paragraph>
            <Paragraph className={classes.name} color="primary" noMargin size="lg" weight="bolder">
              {`${threshold} out of ${ownerList.length} owners`}
            </Paragraph>
          </Block>
        </Block>
      </Col>
      <Col className={classes.ownersColumn} layout="column" xs={8}>
        <TableContainer>
          <Block className={classes.owners}>
            <Paragraph color="primary" noMargin size="lg">
              {`${ownerList.length} Safe owners`}
            </Paragraph>
          </Block>
          <Hairline />
          {ownerList.map((owner, index) => (
            <Fragment key={owner.address}>
              <Row className={classes.owner} testId={'load-safe-review-owner-name-' + index}>
                <Col align="center" xs={12}>
                  <EthHashInfo
                    hash={owner.address}
                    name={owner.name}
                    showAvatar
                    showCopyBtn
                    explorerUrl={getExplorerInfo(owner.address)}
                  />
                </Col>
              </Row>
              {index !== ownerList.length - 1 && <Hairline />}
            </Fragment>
          ))}
        </TableContainer>
      </Col>
    </Row>
  )
}

export default ReviewLoadStep

function checkIfUserAddressIsAnOwner(owners, userAddress) {
  return owners.some((owner) => owner.address === userAddress)
}

const useStyles = makeStyles({
  root: {
    flexDirection: 'column',
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
  owners: {
    padding: lg,
  },
  name: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  owner: {
    alignItems: 'center',
    minWidth: 'fit-content',
    padding: sm,
    paddingLeft: lg,
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
