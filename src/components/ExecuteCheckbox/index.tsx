import { ReactElement } from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import Row from 'src/components/layout/Row'

interface ExecuteCheckboxProps {
  onChange: (val: boolean) => unknown
}

const ExecuteCheckbox = ({ onChange }: ExecuteCheckboxProps): ReactElement => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked)
  }

  return (
    <Row margin="md">
      <FormControlLabel
        control={<Checkbox defaultChecked={true} color="primary" onChange={handleChange} />}
        label="Execute transaction"
        data-testid="execute-checkbox"
      />
    </Row>
  )
}

export default ExecuteCheckbox
