// @flow
import React from 'react'
import Checkbox, { type CheckoxProps } from '@material-ui/core/Checkbox'

class GnoCheckbox extends React.PureComponent<CheckoxProps> {
  render() {
    const {
      input: { checked, name, onChange, ...restInput },
      ...rest
    } = this.props

    return <Checkbox {...rest} name={name} inputProps={restInput} onChange={onChange} checked={!!checked} />
  }
}

export default GnoCheckbox
