import { ReactElement } from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'
import Row from 'src/components/layout/Row'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info.svg'

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
        control={<Checkbox defaultChecked color="secondary" onChange={handleChange} />}
        label="Execute transaction"
        data-testid="execute-checkbox"
      />
      <Tooltip
        placement="top"
        title="If you want to sign the transaction now but manually execute it later, click on the checkbox below."
      >
        <span>
          <Img alt="Info Tooltip" height={16} src={InfoIcon} />
        </span>
      </Tooltip>
    </Row>
  )
}

export default ExecuteCheckbox
