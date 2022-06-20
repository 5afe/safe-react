import styled from 'styled-components'
import { Title } from '@gnosis.pm/safe-react-components'

export const StyledTitle = styled(Title)<{ color?: string; bold?: boolean; centered?: boolean }>`
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  margin: 24px 0;
  color: ${({ color, theme }) => (color ? theme.colors[color] : theme.colors.text)};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`
