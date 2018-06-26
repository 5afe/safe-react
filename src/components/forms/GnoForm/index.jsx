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
  padding: number,
  validation?: (values: Object) => Object | Promise<Object>,
  initialValues?: Object,
  render: Function,
}

const stylesBasedOn = (padding: number): $Shape<CSSStyleDeclaration> => ({
  padding: `0 ${padding}%`,
  display: 'flex',
  flexDirection: 'column',
  flex: '1 0 auto',
})

const GnoForm = ({
  onSubmit, validation, initialValues, children, padding, render,
}: Props) => (
  <Form
    validate={validation}
    onSubmit={onSubmit}
    initialValues={initialValues}
    render={({ handleSubmit, ...rest }) => (
      <form onSubmit={handleSubmit} style={stylesBasedOn(padding)}>
        {render(rest)}
        {children(rest.submitting, rest.submitSucceeded)}
      </form>
    )}
  />
)

export default GnoForm
