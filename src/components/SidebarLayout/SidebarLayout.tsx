import React from 'react'
import styled from 'styled-components'
import { Card } from '@gnosis.pm/safe-react-components'

import Footer from './Footer'

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

const TopbarWrapper = styled.nav`
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(212, 212, 211, 0.59);
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
  z-index: 999;
  grid-area: topbar;
`

const SidebarWrapper = styled.aside`
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

const BodyWrapper = styled.section`
  margin: 24px 16px;
  grid-area: body;
  display: flex;
  flex-direction: column;
  align-content: stretch;
`

export const BodyCard = styled(Card)`
  /* 
  height: 100%; 
  flex-direction: column;
  align-content: stretch;
  */
  flex: 1 100%;
`

export const FooterWrapper = styled.footer`
  margin: 24px 16px;
`

type Props = {
  topbar: React.ReactNode
  sidebar: React.ReactNode
  body: React.ReactNode
}

const Layout = ({ topbar, sidebar, body }: Props): React.ReactElement => (
  <Grid>
    <TopbarWrapper>{topbar}</TopbarWrapper>
    <SidebarWrapper>{sidebar}</SidebarWrapper>
    <BodyWrapper>
      <BodyCard>{body}</BodyCard>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </BodyWrapper>
  </Grid>
)

export default Layout
