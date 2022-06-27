import { useCallback, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useLocation, matchPath, useRouteMatch } from 'react-router-dom'

import { ListItemType } from 'src/components/List'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { MobileNotSupported } from './MobileNotSupported'
import { SAFE_APP_LANDING_PAGE_ROUTE, SAFE_ROUTES, WELCOME_ROUTE } from 'src/routes/routes'
import useDarkMode from 'src/logic/hooks/useDarkMode'
import { screenSm } from 'src/theme/variables'
import { InvalidMasterCopyError } from 'src/components/AppLayout/InvalidMasterCopyError'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background};
`

const HeaderWrapper = styled.nav`
  height: 52px;
  min-height: 52px;
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

const slideIn = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-95%);
  }
`

const SidebarWrapper = styled.aside`
  height: 100%;
  width: 200px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 1;
  overflow: hidden;

  padding: 8px 8px 0 8px;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 1px solid #f0efee;
  box-shadow: 1px 2px 12px rgba(40, 54, 61, 0.08);

  @media (max-width: ${screenSm}px) {
    position: fixed;
    z-index: 1000;
    left: 0;
    transition: transform 200ms ease-out;
    transform: translateX(${({ $expanded }: { $expanded: boolean }) => ($expanded ? '0' : '-95%')});
    animation: ${slideIn} 300ms ease-in;

    &:before {
      content: '';
      position: absolute;
      right: -42px;
      top: 100vh;
      margin-top: -167px;
      width: 40px;
      height: 40px;
      background-color: ${({ theme }) => theme.colors.white};
      border: 2px solid #ececeb;
      border-width: ${({ $expanded }: { $expanded: boolean }) => ($expanded ? '2px 2px 0 2px' : '0 2px 2px 2px')};
      border-radius: ${({ $expanded }: { $expanded: boolean }) => ($expanded ? '6px 6px 0 0' : '0 0 6px 6px')};
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23B2B5B2' d='M7.295 10.293c.36-.36.928-.388 1.32-.083l.094.083 3.292 3.293 3.294-3.293c.36-.36.928-.388 1.32-.083l.094.083c.36.361.389.928.084 1.32l-.084.095-4 4c-.361.36-.928.388-1.32.083l-.095-.083-3.999-4c-.39-.391-.39-1.024 0-1.415z'%3E%3C/path%3E%3C/svg%3E");
      background-size: 100%;
      transform: rotate(${({ $expanded }: { $expanded: boolean }) => ($expanded ? '90' : '-90')}deg);
      transform-origin: center center;
    }
  }
`

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: auto;

  padding: 8px 24px;

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
  const [expanded, setExpanded] = useState(false)
  const { pathname } = useLocation()
  useDarkMode()

  const closeMobileNotSupported = () => setMobileNotSupportedClosed(true)

  const hasFooter = !!matchPath(pathname, {
    path: [SAFE_ROUTES.SETTINGS, WELCOME_ROUTE],
  })

  const showSideBar = !useRouteMatch({ path: SAFE_APP_LANDING_PAGE_ROUTE })
  const onSidebarClick = useCallback(
    (e: React.MouseEvent): void => {
      e.stopPropagation()
      setExpanded((prev) => !prev)
    },
    [setExpanded],
  )

  return (
    <Container onClick={() => setExpanded(false)}>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <InvalidMasterCopyError />

      <BodyWrapper>
        {showSideBar && (
          <SidebarWrapper data-testid="sidebar" $expanded={expanded} onClick={onSidebarClick}>
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
        )}
        <ContentWrapper>
          <div>{children}</div>
          {hasFooter && <Footer />}
        </ContentWrapper>
      </BodyWrapper>

      {!mobileNotSupportedClosed && <MobileNotSupported onClose={closeMobileNotSupported} />}
    </Container>
  )
}

export default Layout
