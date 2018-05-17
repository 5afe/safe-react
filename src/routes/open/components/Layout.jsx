// @flow
import * as React from 'react'
import type { FormApi } from 'react-final-form'
import Stepper from '~/components/Stepper'
import Confirmation from '~/routes/open/components/FormConfirmation'
import Review from '~/routes/open/components/ReviewInformation'
import SafeFields, { safeFieldsValidation } from '~/routes/open/components/SafeForm'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import Link from '~/components/layout/Link'

const getSteps = () => [
  'Fill Safe Form', 'Review Information', 'Deploy it',
]

const initialValuesFrom = (userAccount: string) => ({
  owner0Address: userAccount,
})

type Props = {
  provider: string,
  userAccount: string,
  safeAddress: string,
  safeTx: string,
  onCallSafeContractSubmit: (values: Object, form: FormApi, callback: ?(errors: ?Object) => void)
    => ?Object | Promise<?Object> | void,
}

const Layout = ({
  provider, userAccount, safeAddress, safeTx, onCallSafeContractSubmit,
}: Props) => {
  const steps = getSteps()
  const initialValues = initialValuesFrom(userAccount)
  const finishedButton = <Stepper.FinishButton title="VISIT SAFES" component={Link} to={SAFELIST_ADDRESS} />

  return (
    <React.Fragment>
      { provider
        ? (
          <Stepper
            finishedButton={finishedButton}
            finishedTransaction={!!safeAddress}
            onSubmit={onCallSafeContractSubmit}
            steps={steps}
            initialValues={initialValues}
          >
            <Stepper.Page validate={safeFieldsValidation}>
              { SafeFields }
            </Stepper.Page>
            <Stepper.Page>
              { Review }
            </Stepper.Page>
            <Stepper.Page address={safeAddress} tx={safeTx}>
              { Confirmation }
            </Stepper.Page>
          </Stepper>
        )
        : <div>No metamask detected</div>
      }
    </React.Fragment>
  )
}

export default Layout
