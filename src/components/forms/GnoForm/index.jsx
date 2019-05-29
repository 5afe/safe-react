// @flow
import * as React from 'react'
import { type FormApi } from 'final-form'
import { Form } from 'react-final-form'

export type OnSubmit = (
  values: Object,
  form: FormApi,
  callback: ?(errors: ?Object) => ?Object
) => ?Object | Promise<?Object> | void

type Props = {
  onSubmit: OnSubmit,
  children: Function,
  padding?: number,
  validation?: (values: Object) => Object | Promise<Object>,
  initialValues?: Object,
  formMutators?: Object,
}

const stylesBasedOn = (padding: number): $Shape<CSSStyleDeclaration> => ({
  padding: `0 ${padding}%`,
  flexDirection: 'column',
  flex: '1 0 auto',
})

const GnoForm = ({
  onSubmit, validation, initialValues, children, padding = 0, formMutators,
}: Props) => (
  <Form
    validate={validation}
    onSubmit={onSubmit}
    initialValues={initialValues}
    mutators={formMutators}
    render={({ handleSubmit, ...rest }) => (
      <form onSubmit={handleSubmit} style={stylesBasedOn(padding)}>
        {children(rest.submitting, rest.validating, rest, rest.form.mutators)}
      </form>
    )}
  />
)

export default GnoForm
