import React from 'react'
import styled from 'styled-components'
import { Icon, IconTypes } from '@gnosis.pm/safe-react-components'

const StyledIcon = styled(Icon)`
  min-width: 32px !important;

  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.primary};
`

type Props = {
  type: IconTypes
}

const ListItemIcon = ({ type }: Props): React.ReactElement => <StyledIcon type={type} color="icon" size="md" />

export default ListItemIcon
