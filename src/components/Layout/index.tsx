import React from 'react'
import styled from 'styled-components'
import { Icon, IconText, Card, Text, Divider, Identicon, Button } from '@gnosis.pm/safe-react-components'

import NestedList from '../List'

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

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const IdenticonContainer = styled.div`
  margin: 8px;
  display: flex;
  span {
    align-self: flex-end;
  }
`

const IconContainer = styled.div`
  margin: 8px;
  span {
    margin: 8px;
  }
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
      <WalletInfo>
        <IdenticonContainer>
          <Identicon address="thisIsAnExample" size="md" />
          <Icon size="md" type="circleDropdown" />
        </IdenticonContainer>

        <Text size="xl">Safe Name</Text>
        <Text size="sm">x058...DB78</Text>
        <IconContainer>
          <Icon size="sm" type="qrCode" />
          <Icon size="sm" type="copy" />
          <Icon size="sm" type="externalLink" />
        </IconContainer>
        <Text size="xl">$16.078,57</Text>
        <Button size="md" iconType="transactionsInactive" color="primary" variant="contained">
          New Transaction
        </Button>
        <Divider />
      </WalletInfo>
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
