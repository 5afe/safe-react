import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import Footer from './Footer'

type GridProps = {
  showSidebar: boolean
}
const Grid = styled.div<GridProps>`
  height: 100%;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.background};
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 54px 1fr;
  grid-template-areas:
    'topbar topbar'
    ${({ showSidebar }) => (showSidebar ? `'sidebar body'` : `'body body'`)};
`

const GridTopbarWrapper = styled.nav`
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(212, 212, 211, 0.59);
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
  z-index: 999;
  grid-area: topbar;
`

const GridSidebarWrapper = styled.aside`
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

const GridBodyWrapper = styled.section`
  margin: 0 16px 0 16px;
  grid-area: body;
  display: flex;
  flex-direction: column;
  align-content: stretch;
`

export const BodyWrapper = styled.div`
  flex: 1 100%;
`

export const FooterWrapper = styled.footer`
  margin: 0 16px;
`

type Props = { sidebar: React.ReactNode }

const Layout: React.FC<Props> = ({ sidebar, children }): React.ReactElement => (
  <Grid showSidebar={sidebar !== null}>
    <GridTopbarWrapper>
      <Header />
    </GridTopbarWrapper>
    {sidebar ? <GridSidebarWrapper>{sidebar}</GridSidebarWrapper> : null}
    <GridBodyWrapper>
      <BodyWrapper>{children}</BodyWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </GridBodyWrapper>
  </Grid>
)

export default Layout
