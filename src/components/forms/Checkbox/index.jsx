// @flow
import React from 'react'
import Checkbox, { type CheckoxProps } from 'material-ui/Checkbox'

class GnoCheckbox extends React.PureComponent<CheckoxProps> {
  render() {
    const {
      input: {
        checked, name, onChange, ...restInput
      },
      meta,
      ...rest
    } = this.props

    return (
      <Checkbox
        {...rest}
        name={name}
        inputProps={restInput}
        onChange={onChange}
        checked={!!checked}
      />
    )
  }
}

export default GnoCheckbox
