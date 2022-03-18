import { ReactElement } from 'react'
import styled from 'styled-components'
import { Icon, Divider as DividerSRC } from '@gnosis.pm/safe-react-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 8px 0;

  svg {
    margin: 0 12px 0 4px;
  }
`
const StyledDivider = styled(DividerSRC)`
  width: 100%;
`

const StyledIcon = styled(Icon)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 20px;
  background: white;

  & svg {
    margin: 0;
  }
`

type Props = {
  withArrow?: boolean
}

const Divider = ({ withArrow }: Props): ReactElement => (
  <Wrapper>
    {withArrow && <StyledIcon type="arrowDown" size="md" />}
    <StyledDivider />
  </Wrapper>
)

export default Divider
