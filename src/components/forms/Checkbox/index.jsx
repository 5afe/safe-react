//
import Checkbox from '@material-ui/core/Checkbox'
import React from 'react'

class GnoCheckbox extends React.PureComponent {
  render() {
    const {
      input: { checked, name, onChange, ...restInput },
      ...rest
    } = this.props

    return <Checkbox {...rest} checked={!!checked} inputProps={restInput} name={name} onChange={onChange} />
  }
}

export default GnoCheckbox
