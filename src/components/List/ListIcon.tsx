import styled from 'styled-components'
import { Icon, IconTypes } from '@gnosis.pm/safe-react-components'
import { ThemeColors, ThemeIconSize } from '@gnosis.pm/safe-react-components/dist/theme'

const StyledIcon = styled(Icon)`
  margin-right: 14px;
`

type Props = {
  type: IconTypes
  size?: ThemeIconSize
  color?: ThemeColors
}

const ListItemIcon = ({ type, size, color }: Props): React.ReactElement => (
  <StyledIcon type={type} color={color || 'placeHolder'} size={size || 'md'} />
)

export default ListItemIcon
