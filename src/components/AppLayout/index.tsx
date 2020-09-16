import React from 'react'
import styled from 'styled-components'
import { ListItemType } from 'src/components/List'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

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

const GridTopbarWrapper = styled.nav`
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(212, 212, 211, 0.59);
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
  z-index: 999;
  grid-area: topbar;
`

const GridSidebarWrapper = styled.aside`
  width: 200px;
  padding: 62px 8px 0 8px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 2px solid ${({ theme }) => theme.colors.separator};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: fixed;
  grid-area: sidebar;
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

type Props = {
  sidebarItems: ListItemType[]
  safeAddress: string | undefined
  safeName: string | undefined
  balance: string | undefined
  granted: boolean
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
}

const Layout: React.FC<Props> = ({
  balance,
  safeAddress,
  safeName,
  granted,
  onToggleSafeList,
  onReceiveClick,
  onNewTransactionClick,
  children,
  sidebarItems,
}): React.ReactElement => (
  <Grid>
    <GridTopbarWrapper>
      <Header />
    </GridTopbarWrapper>
    <GridSidebarWrapper>
      <Sidebar
        items={sidebarItems}
        safeAddress={safeAddress}
        safeName={safeName}
        balance={balance}
        granted={granted}
        onToggleSafeList={onToggleSafeList}
        onReceiveClick={onReceiveClick}
        onNewTransactionClick={onNewTransactionClick}
      />
    </GridSidebarWrapper>
    <GridBodyWrapper>
      <BodyWrapper>{children}</BodyWrapper>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </GridBodyWrapper>
  </Grid>
)

export default Layout
