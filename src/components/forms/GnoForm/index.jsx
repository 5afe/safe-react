// @flow
import * as React from 'react'
import { Form } from 'react-final-form'
import type { FormApi } from 'react-final-form'

type Props = {
  onSubmit: (values: Object, form: FormApi, callback: ?(errors: ?Object) => void) => ?Object | Promise<?Object> | void,
  children: React$Node,
  width: string,
  validation?: (values: Object) => Object | Promise<Object>,
  initialValues?: Object,
  render: Function,
}

const calculateWidth = (width: string): $Shape<CSSStyleDeclaration> => ({
  maxWidth: `${width}px`,
})

const GnoForm = ({
  onSubmit, validation, initialValues, children, width, render,
}: Props) => (
  <Form
    validate={validation}
    onSubmit={onSubmit}
    initialValues={initialValues}
    render={({ handleSubmit, ...rest }) => (
      <form onSubmit={handleSubmit} style={calculateWidth(width)}>
        {render(rest)}
        {children}
      </form>
    )}
  />
)

export default GnoForm
