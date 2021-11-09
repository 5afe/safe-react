import { ReactElement } from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import Row from 'src/components/layout/Row'
import Paragraph from '../layout/Paragraph'

interface ExecuteCheckboxProps {
  onChange: (val: boolean) => unknown
}

const ExecuteCheckbox = ({ onChange }: ExecuteCheckboxProps): ReactElement | null => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked)
  }
  return (
    <Row margin="md">
      <Paragraph noMargin>
        If you want to sign the transaction now but manually execute it later, click on the checkbox below.
      </Paragraph>
      <FormControlLabel
        control={<Checkbox defaultChecked color="primary" onChange={handleChange} />}
        label="Execute transaction"
        data-testid="execute-checkbox"
      />
    </Row>
  )
}

export default ExecuteCheckbox
