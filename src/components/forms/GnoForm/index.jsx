// @flow
import { type FormApi } from 'final-form'
import * as React from 'react'
import { Form } from 'react-final-form'

export type OnSubmit = (
  values: Object,
  form: FormApi,
  callback: ?(errors: ?Object) => ?Object,
) => ?Object | Promise<?Object> | void

type Props = {
  onSubmit: OnSubmit,
  children: Function,
  padding?: number,
  validation?: (values: Object) => Object | Promise<Object>,
  initialValues?: Object,
  formMutators?: Object,
  testId?: string,
}

const stylesBasedOn = (padding: number): $Shape<CSSStyleDeclaration> => ({
  padding: `0 ${padding}%`,
  flexDirection: 'column',
  flex: '1 0 auto',
})

const GnoForm = ({ children, formMutators, initialValues, onSubmit, padding = 0, testId = '', validation }: Props) => (
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
