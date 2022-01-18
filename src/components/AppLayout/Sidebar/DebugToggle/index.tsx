import styled from 'styled-components'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import { Switch } from '@gnosis.pm/safe-react-components'
import useCachedState from 'src/utils/storage/useCachedState'
import { LS_USE_PROD_CGW } from 'src/utils/constants'

const StyledContainer = styled.div`
  padding-top: 10px;
  margin-left: 16px;
`

const DebugToggle = (): React.ReactElement => {
  const [enabled = false, setEnabled] = useCachedState<boolean>(LS_USE_PROD_CGW)

  const onToggle = () => {
    setEnabled((prev: boolean) => !prev)

    setTimeout(() => {
      location.reload()
    }, 200)
  }

  return (
    <StyledContainer>
      <FormControlLabel control={<Switch checked={enabled} onChange={onToggle} />} label="Use prod CGW" />
    </StyledContainer>
  )
}

export default DebugToggle
