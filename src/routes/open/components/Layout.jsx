// 
import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import * as React from 'react'

import Stepper, { StepperPage } from 'components/Stepper'
import Block from 'components/layout/Block'
import Heading from 'components/layout/Heading'
import Row from 'components/layout/Row'
import { initContracts } from 'logic/contracts/safeContracts'
import Review from 'routes/open/components/ReviewInformation'
import SafeNameField from 'routes/open/components/SafeNameForm'
import SafeOwnersFields from 'routes/open/components/SafeOwnersConfirmationsForm'
import {
  FIELD_CONFIRMATIONS,
  FIELD_SAFE_NAME,
  getOwnerAddressBy,
  getOwnerNameBy,
} from 'routes/open/components/fields'
import Welcome from 'routes/welcome/components/Layout'
import { history } from 'store'
import { secondary, sm } from 'theme/variables'

const { useEffect } = React

const getSteps = () => ['Name', 'Owners and confirmations', 'Review']

const initialValuesFrom = (userAccount, safeProps) => {
  if (!safeProps) {
    return {
      [getOwnerNameBy(0)]: 'My Wallet',
      [getOwnerAddressBy(0)]: userAccount,
      [FIELD_CONFIRMATIONS]: '1',
    }
  }
  let obj = {}
  const { name, ownerAddresses, ownerNames, threshold } = safeProps
  // eslint-disable-next-line no-restricted-syntax
  for (const [index, value] of ownerAddresses.entries()) {
    const safeName = ownerNames[index] ? ownerNames[index] : 'My Wallet'
    obj = {
      ...obj,
      [getOwnerAddressBy(index)]: value,
      [getOwnerNameBy(index)]: safeName,
    }
  }
  return {
    ...obj,
    [FIELD_CONFIRMATIONS]: threshold || '1',
    [FIELD_SAFE_NAME]: name,
  }
}


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

const Layout = (props) => {
  const { network, onCallSafeContractSubmit, provider, safeProps, userAccount } = props

  useEffect(() => {
    if (provider) {
      initContracts()
    }
  }, [provider])

  const steps = getSteps()

  const initialValues = initialValuesFrom(userAccount, safeProps)

  return (
    <>
      {provider ? (
        <Block>
          <Row align="center">
            <IconButton disableRipple onClick={back} style={iconStyle}>
              <ChevronLeft />
            </IconButton>
            <Heading tag="h2">Create New Safe</Heading>
          </Row>
          <Stepper
            initialValues={initialValues}
            mutators={formMutators}
            onSubmit={onCallSafeContractSubmit}
            steps={steps}
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
        <Welcome isOldMultisigMigration provider={provider} />
      )}
    </>
  )
}

export default Layout
