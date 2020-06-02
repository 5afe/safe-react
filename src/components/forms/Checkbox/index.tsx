import React from 'react'
import { Checkbox } from '@gnosis.pm/safe-react-components'

class GnoCheckbox extends React.PureComponent<any> {
  render() {
    const {
      input: { checked, name, onChange },
      label,
      ...rest
    } = this.props

    return <Checkbox {...rest} checked={!!checked} label={label} name={name} onChange={onChange} />
  }
}

export default GnoCheckbox
