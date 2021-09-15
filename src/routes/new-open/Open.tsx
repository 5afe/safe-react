import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { makeStyles } from '@material-ui/core/'
import { useSelector } from 'react-redux'
import queryString from 'query-string'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import Heading from 'src/components/layout/Heading'
import { history } from 'src/store'
import { sm } from 'src/theme/variables'
import StepperForm, { StepFormElement } from 'src/components/StepperForm/StepperForm'
import SelectNetworkStep, { selectNetworkStepLabel } from 'src/components/SelectNetworkStep/SelectNetworkStep'
import NameNewSafeStep, { nameNewSafeStepLabel } from './steps/NameNewSafeStep'
import { APP_ENV } from 'src/utils/constants'
import {
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_MAX_OWNER_NUMBER,
  FIELD_NEW_SAFE_PROXY_SALT,
  FIELD_NEW_SAFE_THRESHOLD,
  FIELD_SAFE_OWNERS_LIST,
} from './fields/createSafeFields'
import { useMnemonicSafeName } from 'src/logic/hooks/useMnemonicName'
import { providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'
import OwnersAndConfirmationsNewSafeStep, {
  ownersAndConfirmationsNewSafeStepLabel,
  ownersAndConfirmationsNewSafeStepValidations,
} from './steps/OwnersAndConfirmationsNewSafeStep'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import ReviewNewSafeStep, { reviewNewSafeStepLabel } from './steps/ReviewNewSafeStep'
import { useLocation } from 'react-router'
import { FIELD_CUSTOM_SAFE_NAME } from '../open/components/fields'

// TODO: Rename to CreateSafePage
// TODO: Rename to LoadSafePage
function Open(): ReactElement {
  const classes = useStyles()

  const provider = useSelector(providerNameSelector)
  const address = useSelector(userAccountSelector)
  const addressBook = useSelector(currentNetworkAddressBookAsMap)
  const location = useLocation()
  const safeRandomName = useMnemonicSafeName()

  function onSubmitCreateNewSafe(values) {
    // TODO: onSubmitCreateNewSafe
    // TODO: Safe Creation Process Component
    console.log('onSubmitCreateNewSafe', values)
  }

  const isProductionEnv = APP_ENV === 'production'

  const initialValuesFromUrl = getInitialValues(address, addressBook, location, safeRandomName)

  console.log(initialValuesFromUrl)

  return (
    <Page>
      <Block>
        <Row align="center">
          <IconButton disableRipple onClick={history.goBack} className={classes.backIcon}>
            <ChevronLeft />
          </IconButton>
          <Heading tag="h2">Create new Safe</Heading>
        </Row>
        <StepperForm initialValues={initialValuesFromUrl} testId={'load-safe-form'} onSubmit={onSubmitCreateNewSafe}>
          {!isProductionEnv && (
            <StepFormElement label={selectNetworkStepLabel} nextButtonLabel="Continue" disableNextButton={!provider}>
              <SelectNetworkStep />
            </StepFormElement>
          )}
          <StepFormElement label={nameNewSafeStepLabel} nextButtonLabel="Continue">
            <NameNewSafeStep />
          </StepFormElement>
          <StepFormElement
            label={ownersAndConfirmationsNewSafeStepLabel}
            nextButtonLabel="Continue"
            validate={ownersAndConfirmationsNewSafeStepValidations}
          >
            <OwnersAndConfirmationsNewSafeStep />
          </StepFormElement>
          <StepFormElement label={reviewNewSafeStepLabel} nextButtonLabel="Create">
            <ReviewNewSafeStep />
          </StepFormElement>
        </StepperForm>
      </Block>
    </Page>
  )
}

export default Open

const useStyles = makeStyles((theme) => ({
  backIcon: {
    color: theme.palette.secondary.main,
    padding: sm,
    marginRight: '5px',
  },
}))

const DEFAULT_THRESHOLD_VALUE = 1

// initial values can be present in the URL because the Old MultiSig migration
function getInitialValues(userAddress, addressBook, location, suggestedSafeName) {
  const query = queryString.parse(location.search, { arrayFormat: 'comma' })
  const { name, owneraddresses, ownernames, threshold } = query

  // if owners are not present in the URL we use current user account as default owner
  const isOwnersPresentInTheUrl = !!owneraddresses
  const ownersFromUrl = Array.isArray(owneraddresses) ? owneraddresses : [owneraddresses]
  const owners = isOwnersPresentInTheUrl ? ownersFromUrl : [userAddress]

  // we set the owner names
  const ownersNamesFromUrl = Array.isArray(ownernames) ? ownernames : [ownernames]
  const userAddressName = [addressBook[userAddress]?.name || 'My Wallet']
  const ownerNames = isOwnersPresentInTheUrl ? ownersNamesFromUrl : userAddressName

  const thresholdFromURl = Number(threshold)
  const isValidThresholdInTheUrl =
    threshold && !Number.isNaN(threshold) && thresholdFromURl <= owners.length && thresholdFromURl > 0

  return {
    [FIELD_CREATE_SUGGESTED_SAFE_NAME]: suggestedSafeName,
    [FIELD_CUSTOM_SAFE_NAME]: name,
    [FIELD_NEW_SAFE_THRESHOLD]: isValidThresholdInTheUrl ? threshold : DEFAULT_THRESHOLD_VALUE,
    [FIELD_SAFE_OWNERS_LIST]: owners.map((owner, index) => ({
      nameFieldName: `owner-name-${index}`,
      addressFieldName: `owner-address-${index}`,
    })),
    // we set owners address values as owner-address-${index} format in the form state
    ...owners.reduce(
      (ownerAddressFields, ownerAddress, index) => ({
        ...ownerAddressFields,
        [`owner-address-${index}`]: ownerAddress,
      }),
      {},
    ),
    // we set owners name values as owner-name-${index} format in the form state
    ...ownerNames.reduce(
      (ownerNameFields, ownerName, index) => ({
        ...ownerNameFields,
        [`owner-name-${index}`]: ownerName,
      }),
      {},
    ),
    [FIELD_MAX_OWNER_NUMBER]: owners.length,
    [FIELD_NEW_SAFE_PROXY_SALT]: Date.now(),
  }
}
