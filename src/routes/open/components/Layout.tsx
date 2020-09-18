import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import * as React from 'react'

import Stepper, { StepperPage } from 'src/components/Stepper'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
import { initContracts } from 'src/logic/contracts/safeContracts'
import Review from 'src/routes/open/components/ReviewInformation'
import SafeNameField from 'src/routes/open/components/SafeNameForm'
import SafeOwnersFields from 'src/routes/open/components/SafeOwnersConfirmationsForm'
import {
  FIELD_CONFIRMATIONS,
  FIELD_SAFE_NAME,
  getOwnerAddressBy,
  getOwnerNameBy,
} from 'src/routes/open/components/fields'
import Welcome from 'src/routes/welcome/components/Layout'
import { history } from 'src/store'
import { secondary, sm } from 'src/theme/variables'
import { networkSelector, providerNameSelector, userAccountSelector } from '../../../logic/wallets/store/selectors'
import { useSelector } from 'react-redux'

const { useEffect } = React

const getSteps = () => ['Name', 'Owners and confirmations', 'Review']

type SafeProps = {
  name: string
  ownerAddresses: any
  ownerNames: string
  threshold: string
}

type InitialValuesForm = {
  owner0Address?: string
  owner0Name?: string
  confirmations: string
  safeName?: string
}

const initialValuesFrom = (userAccount: string, safeProps?: SafeProps): InitialValuesForm => {
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

type LayoutProps = {
  onCallSafeContractSubmit: (formValues: unknown) => void
  safeProps?: SafeProps
}

const Layout = (props: LayoutProps): React.ReactElement => {
  const { onCallSafeContractSubmit, safeProps } = props

  const provider = useSelector(providerNameSelector)
  const network = useSelector(networkSelector)
  const userAccount = useSelector(userAccountSelector)

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
            <Heading tag="h2" testId="create-safe-form-title">
              Create New Safe
            </Heading>
          </Row>
          <Stepper
            initialValues={initialValues}
            mutators={formMutators}
            onSubmit={onCallSafeContractSubmit}
            steps={steps}
            testId="create-safe-form"
          >
            <StepperPage component={SafeNameField} />
            <StepperPage component={SafeOwnersFields} />
            <StepperPage network={network} userAccount={userAccount} component={Review} />
          </Stepper>
        </Block>
      ) : (
        <Welcome isOldMultisigMigration provider={provider} />
      )}
    </>
  )
}

export default Layout
