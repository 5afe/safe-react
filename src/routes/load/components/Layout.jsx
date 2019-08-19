// @flow
import * as React from 'react'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
import Stepper, { StepperPage } from '~/components/Stepper'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import ReviewInformation from '~/routes/load/components/ReviewInformation'
import OwnerList from '~/routes/load/components/OwnerList'
import DetailsForm, { safeFieldsValidation } from '~/routes/load/components/DetailsForm'
import { history } from '~/store'
import { secondary } from '~/theme/variables'
import { type SelectorProps } from '~/routes/load/container/selector'

const getSteps = () => ['Details', 'Owners', 'Review']

type Props = SelectorProps & {
  onLoadSafeSubmit: (values: Object) => Promise<void>,
}

const iconStyle = {
  color: secondary,
  padding: '8px',
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

const Layout = ({
  provider, onLoadSafeSubmit, network, userAddress,
}: Props) => {
  const steps = getSteps()
  const initialValues = {}

  return (
    <>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton onClick={back} style={iconStyle} disableRipple>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Load existing Safe</Heading>
          </Row>
          <Stepper
            onSubmit={onLoadSafeSubmit}
            steps={steps}
            initialValues={initialValues}
            mutators={formMutators}
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
