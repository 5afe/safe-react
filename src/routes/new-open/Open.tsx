import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { makeStyles } from '@material-ui/core/'
import { useSelector } from 'react-redux'

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
import { getRandomName } from 'src/logic/hooks/useMnemonicName'
import { providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'
import OwnersAndConfirmationsNewSafeStep, {
  ownersAndConfirmationsNewSafeStepLabel,
  ownersAndConfirmationsNewSafeStepValidations,
} from './steps/OwnersAndConfirmationsNewSafeStep'
import { currentNetworkAddressBookAsMap } from 'src/logic/addressBook/store/selectors'
import ReviewNewSafeStep, { reviewNewSafeStepLabel } from './steps/ReviewNewSafeStep'

// TODO: Rename to CreateSafePage
// TODO: Rename to LoadSafePage
function Open(): ReactElement {
  const classes = useStyles()

  const provider = useSelector(providerNameSelector)
  const address = useSelector(userAccountSelector)
  const addressBook = useSelector(currentNetworkAddressBookAsMap)

  function onSubmitCreateNewSafe(values) {
    // TODO: onSubmitCreateNewSafe
    // TODO: Safe Creation Process Component
    console.log('onSubmitCreateNewSafe', values)
  }

  const isProductionEnv = APP_ENV === 'production'

  const initialValues = {
    [FIELD_CREATE_SUGGESTED_SAFE_NAME]: getRandomName('safe'),
    // we set the owner address as a default owner
    ['owner-address-0']: address,
    ['owner-name-0']: addressBook[address]?.name || 'My Wallet',
    [FIELD_SAFE_OWNERS_LIST]: [
      {
        nameFieldName: 'owner-name-0',
        addressFieldName: 'owner-address-0',
      },
    ],
    [FIELD_NEW_SAFE_THRESHOLD]: 1,
    [FIELD_MAX_OWNER_NUMBER]: 1,
    [FIELD_NEW_SAFE_PROXY_SALT]: Date.now(),
  }

  return (
    <Page>
      <Block>
        <Row align="center">
          <IconButton disableRipple onClick={history.goBack} className={classes.backIcon}>
            <ChevronLeft />
          </IconButton>
          <Heading tag="h2">Create new Safe</Heading>
        </Row>
        <StepperForm initialValues={initialValues} testId={'load-safe-form'} onSubmit={onSubmitCreateNewSafe}>
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
