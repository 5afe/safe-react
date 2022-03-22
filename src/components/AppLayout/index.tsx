import { useState } from 'react'
import styled from 'styled-components'
import { useLocation, matchPath } from 'react-router-dom'

import { ListItemType } from 'src/components/List'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { MobileNotSupported } from './MobileNotSupported'
import { SAFE_ROUTES } from 'src/routes/routes'
import useDarkMode from 'src/logic/hooks/useDarkMode'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background};
`

const HeaderWrapper = styled.nav`
  height: 52px;
  width: 100%;
  z-index: 1299;

  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(40, 54, 61, 0.18);
`

const BodyWrapper = styled.div`
  height: calc(100% - 52px);
  width: 100%;
  display: flex;
  flex-direction: row;
`

const SidebarWrapper = styled.aside`
  height: 100%;
  width: 200px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 1;

  padding: 8px 8px 0 8px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px 0 rgba(40, 54, 61, 0.18);
`

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;

  padding: 0 16px;

  > :nth-child(1) {
    flex-grow: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  > :nth-child(2) {
    width: 100%;
    height: 59px;
  }
`

type Props = {
  sidebarItems: ListItemType[]
  safeAddress?: string
  safeName?: string
  balance?: string
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
}): React.ReactElement => {
  const [mobileNotSupportedClosed, setMobileNotSupportedClosed] = useState(false)
  const { pathname } = useLocation()
  useDarkMode()

  const closeMobileNotSupported = () => setMobileNotSupportedClosed(true)

  const noFooter = !!matchPath(pathname, {
    path: [SAFE_ROUTES.APPS],
  })

  return (
    <Container>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <BodyWrapper>
        <SidebarWrapper data-testid="sidebar">
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
        </SidebarWrapper>
        <ContentWrapper>
          <div>{children}</div>
          {!noFooter && <Footer />}
        </ContentWrapper>
      </BodyWrapper>

      {!mobileNotSupportedClosed && <MobileNotSupported onClose={closeMobileNotSupported} />}
    </Container>
  )
}

export default Layout
