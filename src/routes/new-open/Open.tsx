import React, { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import { makeStyles } from '@material-ui/core/'

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
import { FIELD_CREATE_SUGGESTED_SAFE_NAME } from './fields/createSafeFields'
import { getRandomName } from 'src/logic/hooks/useMnemonicName'

function Open(): ReactElement {
  const classes = useStyles()

  function onSubmitCreateNewSafe(values) {
    // TODO: onSubmitCreateNewSafe
    // TODO: Safe Creation Process Component
    console.log('onSubmitCreateNewSafe', values)
  }

  const isProductionEnv = APP_ENV === 'production'

  const initialValues = {
    [FIELD_CREATE_SUGGESTED_SAFE_NAME]: getRandomName('safe'),
  }

  return (
    <Page>
      <Block>
        <Row align="center">
          <IconButton disableRipple onClick={history.goBack} className={classes.backIcon}>
            <ChevronLeft />
          </IconButton>
          <Heading tag="h2">Add existing Safe</Heading>
        </Row>
        <StepperForm initialValues={initialValues} testId={'load-safe-form'} onSubmit={onSubmitCreateNewSafe}>
          {!isProductionEnv && (
            <StepFormElement label={selectNetworkStepLabel} nextButtonLabel="Continue">
              <SelectNetworkStep />
            </StepFormElement>
          )}
          <StepFormElement label={nameNewSafeStepLabel} nextButtonLabel="Continue">
            <NameNewSafeStep />
          </StepFormElement>
          <StepFormElement label={'Owners and Confirmations'} nextButtonLabel="Continue">
            {/* <Owners and Confirmations Step /> */}
            <div>Owners and Confirmations Step</div>
          </StepFormElement>
          <StepFormElement label={'Review'} nextButtonLabel="Create">
            {/* <Review Step /> */}
            <div>Review Step</div>
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
