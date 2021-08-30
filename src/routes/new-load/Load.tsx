import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { makeStyles } from '@material-ui/core/'

import { useSelector } from 'react-redux'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Page from 'src/components/layout/Page'
import Row from 'src/components/layout/Row'
// import StepperForm from 'src/components/StepperForm/StepperForm'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { history } from 'src/store'
import { sm } from 'src/theme/variables'
// import LoadSafeAddressStep from './steps/LoadSafeAddressStep'
// import LoadSafeOwnersStep from './steps/LoadSafeOwnersStep'
// import ReviewLoadStep from './steps/ReviewLoadStep'
import { getRandomName } from 'src/logic/hooks/useMnemonicName'
import { useParams } from 'react-router-dom'
import { FIELD_LOAD_SAFE_ADDRESS, FIELD_LOAD_SUGGESTED_SAFE_NAME } from './constants/load-field-names'
import Stepper, { StepElement } from 'src/components/NewStepper/Stepper'
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
            <StepFormElement
              label={'Fields Step 1'}
              validate={(values) => {
                const errors = {}
                console.log('Validation step 1 form', values)
                return errors
              }}
            >
              <div>
                <div>FIELDS Step 1</div>
              </div>
            </StepFormElement>
            <StepFormElement
              label={'Fields Step 2'}
              validate={(values) => {
                const errors = {}
                console.log('validations: boolean step 2 form', values)
                return errors
              }}
            >
              <div>
                <div>FIELDS Step 2</div>
              </div>
            </StepFormElement>
            <StepFormElement
              label={'Fields Step FINAL'}
              validate={(values) => {
                const errors = {}
                console.log('validations FINAL step form', values)
                return errors
              }}
            >
              <div>
                <div>FIELDS FINAL STEP FORM!!</div>
              </div>
            </StepFormElement>
          </StepperForm>
          <Stepper
            onFinish={() => {
              console.log('Normal Stepper finished')
            }}
          >
            <StepElement label={'Label 1'}>
              <div>Content Step 1</div>
            </StepElement>
            <StepElement label={'Label 2'}>
              <div>Content Step 2</div>
            </StepElement>
            <StepElement label={'Label Final'}>
              <div>Content Step FINAL</div>
            </StepElement>
          </Stepper>
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
