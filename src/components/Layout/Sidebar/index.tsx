import React from 'react'
import styled from 'styled-components'
import { Divider, IconText } from '@gnosis.pm/safe-react-components'

import NestedList from '../../List'
import WalletInfo from '../WalletInfo'

const Container = styled.aside`
  width: 200px;
  padding: 8px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 2px solid ${({ theme }) => theme.colors.separator};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  grid-area: sidebar;

  div:last-of-type {
    margin-top: auto;
  }
`

const StyledDivider = styled(Divider)`
  margin: 16px -8px;
`

const HelpContainer = styled.div`
  margin-bottom: 8px;
`

const Sidebar = (): React.ReactElement => {
  return (
    <Container>
      <WalletInfo address="0xEE63624cC4Dd2355B16b35eFaadF3F7450A9438B" safeName="SomeName" balance="$111,111" />

      <StyledDivider />
      <NestedList />

      <HelpContainer>
        <StyledDivider />
        <IconText iconSize="md" textSize="sm" iconType="question" text="Help Center" />
      </HelpContainer>
    </Container>
  )
}

export default Sidebar
