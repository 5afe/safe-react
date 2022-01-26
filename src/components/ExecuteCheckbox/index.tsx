import { ReactElement } from 'react'
import { Tooltip } from '@gnosis.pm/safe-react-components'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import styled from 'styled-components'

import Row from 'src/components/layout/Row'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info.svg'

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: 8px;

  & .MuiFormControlLabel-label {
    font-size: 16px;
    letter-spacing: 0;
  }
`

interface ExecuteCheckboxProps {
  onChange: (val: boolean) => unknown
}

const ExecuteCheckbox = ({ onChange }: ExecuteCheckboxProps): ReactElement => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked)
  }
  return (
    <Row style={{ alignItems: 'center' }}>
      <StyledFormControlLabel
        control={<Checkbox defaultChecked color="secondary" onChange={handleChange} />}
        label="Execute transaction"
        data-testid="execute-checkbox"
      />
      <Tooltip
        placement="top"
        title="If you want to sign the transaction now but manually execute it later, click on the checkbox."
      >
        <span>
          <Img alt="Info Tooltip" height={16} src={InfoIcon} />
        </span>
      </Tooltip>
    </Row>
  )
}

export default ExecuteCheckbox
