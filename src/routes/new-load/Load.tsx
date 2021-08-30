import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { makeStyles } from '@material-ui/core/'

import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { history } from 'src/store'
import { sm } from 'src/theme/variables'
import LoadSafeAddressStep, {
  FIELD_LOAD_SAFE_ADDRESS,
  FIELD_LOAD_SUGGESTED_SAFE_NAME,
  loadSafeAddressStepLabel,
  loadSafeAddressStepValidations,
} from './steps/LoadSafeAddressStep'
import LoadSafeOwnersStep, { loadSafeOwnersStepLabel, loadSafeOwnersStepValidation } from './steps/LoadSafeOwnersStep'
import ReviewLoadStep, { reviewLoadStepLabel, reviewLoadStepValidations } from './steps/ReviewLoadStep'
import { getRandomName } from 'src/logic/hooks/useMnemonicName'
import StepperForm, { StepFormElement } from 'src/components/StepperForm/StepperForm'

function Load(): ReactElement {
  const provider = useSelector(providerNameSelector)

  const classes = useStyles()

  const { safeAddress } = useParams<{ safeAddress?: string }>()

  const initialValues = {
    [FIELD_LOAD_SUGGESTED_SAFE_NAME]: getRandomName('safe'),
    [FIELD_LOAD_SAFE_ADDRESS]: safeAddress,
  }

  // TODO: onsubmit
  const onSubmitLoadSafe = (values) => {
    console.log('SUBMIT LOAD SAFE', values)
  }
  return (
    <Page>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton disableRipple onClick={history.goBack} className={classes.backIcon}>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Add existing Safe</Heading>
          </Row>

          <StepperForm initialValues={initialValues} testId={'load-safe-form'} onSubmit={onSubmitLoadSafe}>
            <StepFormElement label={loadSafeAddressStepLabel} validate={loadSafeAddressStepValidations}>
              <LoadSafeAddressStep />
            </StepFormElement>
            <StepFormElement label={loadSafeOwnersStepLabel} validate={loadSafeOwnersStepValidation}>
              <LoadSafeOwnersStep />
            </StepFormElement>
            <StepFormElement label={reviewLoadStepLabel} validate={reviewLoadStepValidations}>
              <ReviewLoadStep />
            </StepFormElement>
          </StepperForm>
        </Block>
      ) : (
        <div>No account detected</div>
      )}
    </Page>
  )
}

export default Load

const useStyles = makeStyles((theme) => ({
  backIcon: {
    color: theme.palette.secondary.main,
    padding: sm,
    marginRight: '5px',
  },
}))
