import * as React from 'react'
import { Form } from 'react-final-form'

const stylesBasedOn = (padding) => ({
  padding: `0 ${padding}%`,
  flexDirection: 'column',
  flex: '1 0 auto',
})

const GnoForm = ({
  children,
  decorators,
  formMutators,
  initialValues,
  onSubmit,
  padding = 0,
  subscription,
  testId = '',
  validation,
}: any) => (
  <Form
    decorators={decorators}
    initialValues={initialValues}
    mutators={formMutators}
    onSubmit={onSubmit}
    render={({ handleSubmit, ...rest }) => (
      <form data-testid={testId} onSubmit={handleSubmit} style={stylesBasedOn(padding) as any}>
        {children(rest.submitting, rest.validating, rest, rest.form.mutators)}
      </form>
    )}
    subscription={subscription}
    validate={validation}
  />
)

export default GnoForm
