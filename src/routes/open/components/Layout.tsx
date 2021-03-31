import IconButton from '@material-ui/core/IconButton'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import * as React from 'react'

import Stepper, { StepperPage } from 'src/components/Stepper'
import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Row from 'src/components/layout/Row'
import { instantiateSafeContracts } from 'src/logic/contracts/safeContracts'
import { Review } from 'src/routes/open/components/ReviewInformation'
import SafeNameField from 'src/routes/open/components/SafeNameForm'
import { SafeOwnersPage, validateOwnersForm } from 'src/routes/open/components/SafeOwnersConfirmationsForm'
import {
  FIELD_CONFIRMATIONS,
  FIELD_CREATION_PROXY_SALT,
  FIELD_SAFE_NAME,
  getOwnerAddressBy,
  getOwnerNameBy,
} from 'src/routes/open/components/fields'
import { WelcomeLayout } from 'src/routes/welcome/components/index'
import { history } from 'src/store'
import { secondary, sm } from 'src/theme/variables'
import { providerNameSelector, userAccountSelector } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'
import { addressBookSelector } from 'src/logic/addressBook/store/selectors'
import { getNameFromAddressBook } from 'src/logic/addressBook/utils'
import { SafeProps } from 'src/routes/open/container/Open'

const { useEffect } = React

const getSteps = () => ['Name', 'Owners and confirmations', 'Review']

export type InitialValuesForm = {
  owner0Address?: string
  owner0Name?: string
  confirmations: string
  safeName?: string
  safeCreationSalt: number
}

const useInitialValuesFrom = (userAccount: string, safeProps?: SafeProps): InitialValuesForm => {
  const addressBook = useSelector(addressBookSelector)
  const ownerName = getNameFromAddressBook(addressBook, userAccount, { filterOnlyValidName: true })

  if (!safeProps) {
    return {
      [getOwnerNameBy(0)]: ownerName || 'My Wallet',
      [getOwnerAddressBy(0)]: userAccount,
      [FIELD_CONFIRMATIONS]: '1',
      [FIELD_CREATION_PROXY_SALT]: Date.now(),
    }
  }
  let obj = {}
  const { name, ownerAddresses, ownerNames, threshold } = safeProps

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
    [FIELD_CREATION_PROXY_SALT]: Date.now(),
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

export const Layout = (props: LayoutProps): React.ReactElement => {
  const { onCallSafeContractSubmit, safeProps } = props

  const provider = useSelector(providerNameSelector)
  const userAccount = useSelector(userAccountSelector)

  useEffect(() => {
    if (provider) {
      instantiateSafeContracts()
    }
  }, [provider])

  const steps = getSteps()

  const initialValues = useInitialValuesFrom(userAccount, safeProps)

  if (!provider) {
    return <WelcomeLayout isOldMultisigMigration />
  }

  return (
    <Block>
      <Row align="center">
        <IconButton disableRipple onClick={back} style={iconStyle}>
          <ChevronLeft />
        </IconButton>
        <Heading tag="h2" testId="create-safe-form-title">
          Create new Safe
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
        <StepperPage component={SafeOwnersPage} validate={validateOwnersForm} />
        <StepperPage component={Review} />
      </Stepper>
    </Block>
  )
}
