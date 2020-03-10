// @flow
import React from 'react'
import { OnChange } from 'react-final-form-listeners'

import GnoField from '~/components/forms/Field'
type Props = {
  field: string,
  set: string,
  to: string | number | null,
}

const WhenFieldChanges = ({ field, set, to }: Props) => (
  <GnoField name={set} subscription={{}}>
    {(
      // No subscription. We only use Field to get to the change function
      { input: { onChange } },
    ) => (
      <OnChange name={field}>
        {value => {
          onChange(to)
        }}
      </OnChange>
    )}
  </GnoField>
)
export default WhenFieldChanges
