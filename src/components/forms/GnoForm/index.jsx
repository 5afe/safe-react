// 
import { } from 'final-form'
import * as React from 'react'
import { Form } from 'react-final-form'



const stylesBasedOn = (padding) => ({
  padding: `0 ${padding}%`,
  flexDirection: 'column',
  flex: '1 0 auto',
})

const GnoForm = ({ children, formMutators, initialValues, onSubmit, padding = 0, testId = '', validation }) => (
  <Form
    initialValues={initialValues}
    mutators={formMutators}
    onSubmit={onSubmit}
    render={({ handleSubmit, ...rest }) => (
      <form data-testid={testId} onSubmit={handleSubmit} style={stylesBasedOn(padding)}>
        {children(rest.submitting, rest.validating, rest, rest.form.mutators)}
      </form>
    )}
    validate={validation}
  />
)

export default GnoForm
