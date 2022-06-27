import styled from 'styled-components'
import { Title, Text } from '@gnosis.pm/safe-react-components'

export const StyledTitle = styled(Title)<{ color?: string; bold?: boolean; centered?: boolean }>`
  font-size: 20px;
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  margin: 24px 0;
  color: ${({ color, theme }) => (color ? theme.colors[color] : theme.colors.text)};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`

export const StyledSecurityTitle = styled(Text)`
  text-align: center;
  color: #b2bbc0;
  margin: 0 80px;
`
