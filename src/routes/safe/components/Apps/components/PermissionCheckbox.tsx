import styled from 'styled-components'
import { Checkbox, FormControlLabel } from '@material-ui/core'

type PermissionsCheckboxProps = {
  label: string
  name: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

const PermissionsCheckbox = ({ label, checked, onChange, name }: PermissionsCheckboxProps): React.ReactElement => (
  <StyledFormControlLabel control={<Checkbox checked={checked} onChange={onChange} name={name} />} label={label} />
)

const StyledFormControlLabel = styled(FormControlLabel)`
  flex: 1;
  .MuiIconButton-root:not(.Mui-checked) {
    color: ${({ theme }) => theme.colors.inputDisabled};
  }
`
export default PermissionsCheckbox
