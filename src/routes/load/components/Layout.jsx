//
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import * as React from 'react'

import Stepper, { StepperPage } from 'components/Stepper'
import Block from 'components/layout/Block'
import Heading from 'components/layout/Heading'
import Row from 'components/layout/Row'
import DetailsForm, { safeFieldsValidation } from 'routes/load/components/DetailsForm'
import OwnerList from 'routes/load/components/OwnerList'
import ReviewInformation from 'routes/load/components/ReviewInformation'
import {} from 'routes/load/container/selector'
import { history } from 'store'
import { secondary, sm } from 'theme/variables'

const getSteps = () => ['Name and address', 'Owners', 'Review']

const iconStyle = {
  color: secondary,
  padding: sm,
  marginRight: '5px',
}

const back = () => {
  history.goBack()
}

const formMutators = {
  setValue: ([field, value], state, { changeValue }) => {
    changeValue(state, field, () => value)
  },
}

const buttonLabels = ['Next', 'Review', 'Load']

const Layout = ({ network, onLoadSafeSubmit, provider, userAddress }) => {
  const steps = getSteps()
  const initialValues = {}

  return (
    <>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton disableRipple onClick={back} style={iconStyle}>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Load existing Safe</Heading>
          </Row>
          <Stepper
            buttonLabels={buttonLabels}
            initialValues={initialValues}
            mutators={formMutators}
            onSubmit={onLoadSafeSubmit}
            steps={steps}
            testId="load-safe-form"
          >
            <StepperPage validate={safeFieldsValidation}>{DetailsForm}</StepperPage>
            <StepperPage network={network}>{OwnerList}</StepperPage>
            <StepperPage network={network} userAddress={userAddress}>
              {ReviewInformation}
            </StepperPage>
          </Stepper>
        </Block>
      ) : (
        <div>No account detected</div>
      )}
    </>
  )
}

export default Layout
