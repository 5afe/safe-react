import { ReactElement } from 'react'
import { Tooltip } from '@gnosis.pm/safe-react-components'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import styled from 'styled-components'

import { sm } from 'src/theme/variables'
import Row from 'src/components/layout/Row'
import Img from 'src/components/layout/Img'
import InfoIcon from 'src/assets/icons/info.svg'

const StyledRow = styled(Row)`
  align-items: center;
  margin-bottom: ${sm};
`

const StyledFormControlLabel = styled(FormControlLabel)`
  margin-right: ${sm};

  & .MuiFormControlLabel-label {
    font-size: 16px;
    letter-spacing: 0;
  }
`

interface ExecuteCheckboxProps {
  checked: boolean
  onChange: (val: boolean) => unknown
}

const ExecuteCheckbox = ({ checked, onChange }: ExecuteCheckboxProps): ReactElement => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.checked)
  }
  return (
    <StyledRow>
      <StyledFormControlLabel
        control={<Checkbox checked={checked} color="secondary" onChange={handleChange} />}
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
    </StyledRow>
  )
}

export default ExecuteCheckbox
