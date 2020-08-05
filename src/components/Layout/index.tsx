import React from 'react'
import styled from 'styled-components'
import { IconText, Card, Divider } from '@gnosis.pm/safe-react-components'

import NestedList from '../List'
import WalletInfo from '../WalletInfo'

const Grid = styled.div`
  height: 100%;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.background};
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 54px 1fr;
  grid-template-areas:
    'topbar topbar'
    'sidebar body';
`

const Topbar = styled.nav`
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(212, 212, 211, 0.59);
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
  z-index: 999;
  grid-area: topbar;
`
const Sidebar = styled.aside`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 2px solid ${({ theme }) => theme.colors.separator};
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
`

const Body = styled.section`
  margin: 24px 16px;
  grid-area: body;
  display: flex;
  flex-direction: column;
  align-content: stretch;
`

const MainContent = styled(Card)`
  /* height: 100%; */
  flex: 1 100%;
  /* flex-direction: column;
  align-content: stretch; */
`

const Footer = styled.footer`
  margin: 24px 16px;
`

const StyledIconText = styled(IconText)`
  font-size: 0.68em;
  font-weight: 900;
  line-height: 1.5;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 16px 0;
`
const HelpContainer = styled.div`
  margin-top: auto;
`
const StyledIconTextHelp = styled(IconText)`
  margin: 0 0 8px 16px;
`

const Layout = (): React.ReactElement => (
  <Grid>
    <Topbar>Gnosis Logo</Topbar>
    <Sidebar>
      <WalletInfo address="0xEE63624cC4Dd2355B16b35eFaadF3F7450A9438B" safeName="SomeName" balance="$111,111" />

      <NestedList />
      <HelpContainer>
        <Divider />
        <StyledIconTextHelp iconSize="md" textSize="sm" iconType="question" text="Help Center" />
      </HelpContainer>
    </Sidebar>
    <Body>
      <StyledIconText iconSize="sm" textSize="sm" color="primary" iconType="assets" text="Assets" />
      <MainContent>
        <div>Body</div>
      </MainContent>
      <Footer>footer</Footer>
    </Body>
  </Grid>
)

export default Layout
