// @flow
import * as React from 'react'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import IconButton from '@material-ui/core/IconButton'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
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

const getSteps = () => ['Name', 'Owners and confirmations', 'Review']

const validateQueryParams = (ownerAddresses?: string[], ownerNames?: string[], threshold?: string, safeName?: string) => {
  if (!ownerAddresses || !ownerNames || !threshold || !safeName) {
    return false
  }
  if (!ownerAddresses.length === 0 || ownerNames.length === 0) {
    return false
  }
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(threshold)) {
    return false
  }
  if (threshold > ownerAddresses.length) {
    return false
  }
  return true
}

const initialValuesFrom = (userAccount: string, ownerAddresses?: string[], ownerNames?: string[], threshold?: string, safeName?: string) => {
  if (!validateQueryParams(ownerAddresses, ownerNames, threshold, safeName)) {
    return ({
      [getOwnerNameBy(0)]: 'My Wallet',
      [getOwnerAddressBy(0)]: userAccount,
      [FIELD_CONFIRMATIONS]: '1',
    })
  }
  let obj = {}
  for (const [index, value] of ownerAddresses.entries()) {
    const name = ownerNames[index] ? ownerNames[index] : 'My Wallet'
    obj = {
      ...obj,
      [getOwnerAddressBy(index)]: value,
      [getOwnerNameBy(index)]: name,
    }
  }
  return ({
    ...obj,
    [FIELD_CONFIRMATIONS]: threshold || '1',
    [FIELD_SAFE_NAME]: safeName,
  })
}

type Props = {
  provider: string,
  userAccount: string,
  network: string,
  onCallSafeContractSubmit: (values: Object) => Promise<void>,
  location: Object,
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

export type SafeProps = {
  name: string,
  owneraddresses: string[],
  ownerNames: string[],
  threshold: string,
}

const Layout = (props: Props) => {
  const {
    provider, userAccount, onCallSafeContractSubmit, network, location,
  } = props
  const steps = getSteps()
  const query: SafeProps = queryString.parse(location.search, { arrayFormat: 'comma' })
  const {
    name, owneraddresses, ownernames, threshold,
  } = query

  const initialValues = initialValuesFrom(userAccount, owneraddresses, ownernames, threshold, name)


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
        <div>No web3 provider detected</div>
      )}
    </>
  )
}

export default withRouter(Layout)
