// @flow
import Checkbox, { type CheckoxProps } from '@material-ui/core/Checkbox'
import React from 'react'

class GnoCheckbox extends React.PureComponent<CheckoxProps> {
  render() {
    const {
      input: { checked, name, onChange, ...restInput },
      ...rest
    } = this.props

    return <Checkbox {...rest} checked={!!checked} inputProps={restInput} name={name} onChange={onChange} />
  }
}

export default GnoCheckbox
