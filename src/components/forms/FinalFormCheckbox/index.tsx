import React, { useState } from 'react'
import { Checkbox, Text } from '@gnosis.pm/safe-react-components'

interface FinalFormCheckboxProps {
  name: string
  label: React.ReactNode
  input: CheckboxInput
}

type CheckboxInput = {
  onBlur: (ev: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: (ev: React.ChangeEvent<HTMLInputElement>) => void
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void
}
const FinalFormCheckbox = ({ input, name, label }: FinalFormCheckboxProps): React.ReactElement => {
  const [checked, setChecked] = useState(false)

  const handleOnChange = (
    { onBlur, onFocus, onChange }: CheckboxInput,
    event: React.ChangeEvent<HTMLInputElement>,
    value: boolean,
  ) => {
    onFocus(event)
    onChange(event)
    onBlur(event)
    setChecked(value)
  }
  return (
    <Checkbox
      checked={checked}
      name={name}
      label={<Text size="xl">{label}</Text>}
      onChange={(ev: React.ChangeEvent<HTMLInputElement>, value: boolean) => handleOnChange(input, ev, value)}
    />
  )
}

export default FinalFormCheckbox
