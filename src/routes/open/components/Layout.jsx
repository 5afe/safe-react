// @flow
import * as React from 'react'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
import Stepper, { StepperPage } from '~/components/Stepper'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Review from '~/routes/open/components/ReviewInformation'
import SafeNameField from '~/routes/open/components/SafeNameForm'
import SafeOwnersFields from '~/routes/open/components/SafeOwnersConfirmationsForm'
import {
  getOwnerNameBy,
  getOwnerAddressBy,
  FIELD_CONFIRMATIONS,
  FIELD_SAFE_NAME,
} from '~/routes/open/components/fields'
import { history } from '~/store'
import { secondary } from '~/theme/variables'
import type { SafePropsType } from '~/routes/open/container/Open'
import Welcome from '~/routes/welcome/components/Layout'

const getSteps = () => ['Name', 'Owners and confirmations', 'Review']


const initialValuesFrom = (userAccount: string, safeProps?: SafePropsType) => {
  if (!safeProps) {
    return ({
      [getOwnerNameBy(0)]: 'My Wallet',
      [getOwnerAddressBy(0)]: userAccount,
      [FIELD_CONFIRMATIONS]: '1',
    })
  }
  let obj = {}
  const {
    ownerAddresses, ownerNames, threshold, name,
  } = safeProps
  // eslint-disable-next-line no-restricted-syntax
  for (const [index, value] of ownerAddresses.entries()) {
    const safeName = ownerNames[index] ? ownerNames[index] : 'My Wallet'
    obj = {
      ...obj,
      [getOwnerAddressBy(index)]: value,
      [getOwnerNameBy(index)]: safeName,
    }
  }
  return ({
    ...obj,
    [FIELD_CONFIRMATIONS]: threshold || '1',
    [FIELD_SAFE_NAME]: name,
  })
}

type Props = {
  provider: string,
  userAccount: string,
  network: string,
  onCallSafeContractSubmit: (values: Object) => Promise<void>,
  safeProps?: SafePropsType,
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


const Layout = (props: Props) => {
  const {
    provider, userAccount, onCallSafeContractSubmit, network, safeProps,
  } = props
  const steps = getSteps()

  const initialValues = initialValuesFrom(userAccount, safeProps)

  return (
    <>
      {provider ? (
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
            mutators={formMutators}
            testId="create-safe-form"
          >
            <StepperPage>{SafeNameField}</StepperPage>
            <StepperPage>{SafeOwnersFields}</StepperPage>
            <StepperPage network={network} userAccount={userAccount}>
              {Review}
            </StepperPage>
          </Stepper>
        </Block>
      ) : (
        <Welcome provider={provider} isOldMultisigMigration />
      )}
    </>
  )
}

export default Layout
