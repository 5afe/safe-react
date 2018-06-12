// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import SnackbarContent from '~/components/SnackbarContent'
import Checkbox from '~/components/forms/Checkbox'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'

export const DECREASE_PARAM = 'decrease'

type Props = {
  numOwners: number,
  threshold: number,
  name: string,
  disabled: boolean,
  pendingTransactions: boolean,
}

const RemoveOwnerForm = ({
  numOwners, threshold, name, disabled, pendingTransactions,
}: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Remove Owner { !!name && name }
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Actual number of owners: ${numOwners}, threhsold of safe: ${threshold}`}
    </Heading>
    { pendingTransactions &&
      <SnackbarContent
        variant="warning"
        message="Be careful removing and owner might incur in some of the pending transactions could never be executed"
      />
    }
    <Block margin="md">
      <Field
        name={DECREASE_PARAM}
        component={Checkbox}
        type="checkbox"
        disabled={disabled}
      />
      <Block>{disabled && '(disabled) '}Decrease threshold?</Block>
    </Block>
  </Block>
)

export default RemoveOwnerForm
