// @flow
import * as React from 'react'
import { Form } from 'react-final-form'

type Props = {
  onSubmit: Function,
  children: Function,
  width: string,
}

const calculateWidth = (width: string): $Shape<CSSStyleDeclaration> => ({
  maxWidth: width,
})

const GnoForm = ({ onSubmit, children, width }: Props) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit, ...rest }) => (
      <form onSubmit={handleSubmit} style={calculateWidth(width)}>
        {children(rest)}
      </form>
    )}
  />
)

export default GnoForm
