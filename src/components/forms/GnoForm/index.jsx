// @flow
import { type Decorator, type FormApi } from 'final-form'
import * as React from 'react'
import { Form } from 'react-final-form'

export type OnSubmit = (
  values: Object,
  form: FormApi,
  callback: ?(errors: ?Object) => ?Object,
) => ?Object | Promise<?Object> | void

type Props = {
  children: Function,
  decorators?: Decorator<{ [string]: any }>[],
  formMutators?: Object,
  initialValues?: Object,
  onSubmit: OnSubmit,
  subscription?: Object,
  padding?: number,
  testId?: string,
  validation?: (values: Object) => Object | Promise<Object>,
}

const stylesBasedOn = (padding: number): $Shape<CSSStyleDeclaration> => ({
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
}: Props) => (
  <Form
    decorators={decorators}
    initialValues={initialValues}
    mutators={formMutators}
    onSubmit={onSubmit}
    render={({ handleSubmit, ...rest }) => (
      <form data-testid={testId} onSubmit={handleSubmit} style={stylesBasedOn(padding)}>
        {children(rest.submitting, rest.validating, rest, rest.form.mutators)}
      </form>
    )}
    subscription={subscription}
    validate={validation}
  />
)

export default GnoForm
