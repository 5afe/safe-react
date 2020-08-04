import React from 'react'
import styled from 'styled-components'
import { Icon, IconText, Card, Text, Divider, Identicon, Button } from '@gnosis.pm/safe-react-components'

import NestedList from '../List'

const Container = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 54px 1fr;
  grid-template-areas:
    'topbar topbar'
    'sidebar body';

  /* @media (max-width: 400px) {
    grid-template-columns: 1fr;
    grid-template-rows: 54px auto 1fr;
    grid-template-areas:
      'topbar'
      'sidebar'
      'body';
  } */
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

const IconContainer = styled.div`
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
`

const StyledIconText = styled(IconText)`
  font-size: 0.68em;
  font-weight: 900;
  line-height: 1.5;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 16px 0;
`

const Layout = (): React.ReactElement => (
  <Container>
    <Topbar>Gnosis Logo</Topbar>
    <Sidebar>
      <WalletInfo>
        <IconContainer>
          <Identicon address="thisIsAnExample" size="md" />
        </IconContainer>
        <Icon size="md" type="circleDropdown" />

        <Text size="xl">Safe Name</Text>
        <Text size="sm">x058...DB78</Text>
        <IconContainer>
          <Icon size="sm" type="qrCode" />
          <Icon size="sm" type="copy" />
          <Icon size="sm" type="externalLink" />
        </IconContainer>
        <Button size="md" iconType="transactionsInactive" color="primary" variant="contained">
          New Transaction
        </Button>
      </WalletInfo>
      <Divider />
      <NestedList />
      <Divider />
      <Icon size="md" type="question" />
      <Text size="sm">Help Center</Text>
    </Sidebar>
    <Body>
      <StyledIconText iconSize="sm" textSize="sm" color="primary" iconType="assets" text="Assets" />
      <MainContent>
        <div>Body</div>
      </MainContent>
      <Footer>footer</Footer>
    </Body>
  </Container>
)

export default Layout
