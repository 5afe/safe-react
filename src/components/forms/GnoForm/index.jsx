// @flow
import * as React from 'react'
import { Form } from 'react-final-form'
import type { FormApi } from 'react-final-form'

type Props = {
  onSubmit: (values: Object, form: FormApi, callback: ?(errors: ?Object) => void) => ?Object | Promise<?Object> | void,
  children: React$Node,
  padding: number,
  validation?: (values: Object) => Object | Promise<Object>,
  initialValues?: Object,
  render: Function,
}

const stylesBasedOn = (padding: number): $Shape<CSSStyleDeclaration> => ({
  padding: `0 ${padding}px`,
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
        {children}
      </form>
    )}
  />
)

export default GnoForm
