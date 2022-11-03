import styled from 'styled-components'
import { Title, Text } from '@gnosis.pm/safe-react-components'

export const StyledTitle = styled(Title)<{ color?: string; bold?: boolean; centered?: boolean }>`
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  margin: 24px 0;
  color: inherit;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
`

export const StyledSecurityTitle = styled(Text)`
  text-align: center;
  color: #b2bbc0;
  margin: 0 75px;
`
