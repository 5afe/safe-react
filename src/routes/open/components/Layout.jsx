// @flow
import * as React from 'react'
import Stepper from '~/components/Stepper'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import IconButton from '@material-ui/core/IconButton'
import Review from '~/routes/open/components/ReviewInformation'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import SafeFields, { safeFieldsValidation } from '~/routes/open/components/SafeForm'
import SafeNameField from '~/routes/open/components/SafeNameForm'
import { history } from '~/store'
import { secondary } from '~/theme/variables'

const getSteps = () => [
  'Start', 'Details', 'Review',
]

const initialValuesFrom = (userAccount: string) => ({
  owner0Address: userAccount,
})

type Props = {
  provider: string,
  userAccount: string,
  onCallSafeContractSubmit: (values: Object) => Promise<void>,
}

const iconStyle = {
  color: secondary,
  width: '32px',
  height: '32px',
}

const back = () => {
  history.goBack()
}

const Layout = ({
  provider, userAccount, onCallSafeContractSubmit,
}: Props) => {
  const steps = getSteps()
  const initialValues = initialValuesFrom(userAccount)

  return (
    <React.Fragment>
      { provider
        ? (
          <Block>
            <Row align="center">
              <IconButton onClick={back} style={iconStyle} disableRipple>
                <ChevronLeft />
              </IconButton>
              <Heading tag="h2">Create New Safe</Heading>
            </Row>
            <Stepper
              onSubmit={onCallSafeContractSubmit}
              steps={steps}
              initialValues={initialValues}
            >
              <Stepper.Page>
                { SafeNameField }
              </Stepper.Page>
              <Stepper.Page validate={safeFieldsValidation}>
                { SafeFields }
              </Stepper.Page>
              <Stepper.Page>
                { Review }
              </Stepper.Page>
            </Stepper>
          </Block>
        )
        : <div>No metamask detected</div>
      }
    </React.Fragment>
  )
}

export default Layout
