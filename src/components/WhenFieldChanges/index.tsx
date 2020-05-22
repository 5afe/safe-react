import React from 'react'
import { OnChange } from 'react-final-form-listeners'

import GnoField from 'src/components/forms/Field'

const WhenFieldChanges = ({ field, set, to }) => (
  <GnoField name={set} subscription={{}}>
    {(
      // No subscription. We only use Field to get to the change function
      { input: { onChange } },
    ) => (
      <OnChange name={field}>
        {() => {
          onChange(to)
        }}
      </OnChange>
    )}
  </GnoField>
)
export default WhenFieldChanges
