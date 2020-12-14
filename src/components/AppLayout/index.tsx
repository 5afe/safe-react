import React from 'react'
import styled from 'styled-components'
import { ListItemType } from 'src/components/List'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { screenXs } from 'src/theme/variables'
import { Button, Card, Text } from '@gnosis.pm/safe-react-components'
import Phone from './MobileStart/assets/phone@2x.png'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background};

  /* @media (max-width: ${screenXs}px) {
    background-color: ${({ theme }) => theme.colors.primary};
    position: fixed;
    height: 100vh;
    width: 100vw;
  } */
`

const HeaderWrapper = styled.nav`
  height: 54px;
  width: 100%;
  z-index: 1;

  background-color: white;
  box-shadow: 0 0 4px 0 rgba(212, 212, 211, 0.59);
`

const BodyWrapper = styled.div`
  height: calc(100% - 54px);
  width: 100%;
  display: flex;
  flex-direction: row;
`

const SidebarWrapper = styled.aside`
  height: 100%;
  width: 200px;
  display: flex;
  flex-direction: column;
  z-index: 1;

  padding: 8px 8px 0 8px;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 2px solid ${({ theme }) => theme.colors.separator};
`

const ContentWrapper = styled.section`
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
const ModalApp = styled.div`
  display: none;

  @media (max-width: ${screenXs}px) {
    position: fixed;
    display: flex;
    bottom: 0;
    width: 100vw;
    height: 260px;
    background-color: ${({ theme }) => theme.colors.background};
    z-index: 2147483004; /* on top of Intercom Button*/
    padding: 20px 16px;
  }
`

const StyledCard = styled(Card)`
  background-color: #fdfdfd;
  width: 245px;
  height: 220px;
  padding: 24px 40px 24px 24px;
  box-sizing: border-box;
  box-shadow: none;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
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
  <Container>
    <HeaderWrapper>
      <Header />
    </HeaderWrapper>
    <BodyWrapper>
      <SidebarWrapper>
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
        <Footer />
      </ContentWrapper>
    </BodyWrapper>
    <ModalApp>
      <StyledCard>
        <Text size="lg">The Safe Multisig web app is not optimized for mobile.</Text>
        <Text size="lg">Get the mobile app for a better experience.</Text>
        <Button size="md" color="primary" variant="contained">
          Get the App
        </Button>
      </StyledCard>
      <img src={Phone} alt="Phone" width="45%" />
    </ModalApp>
  </Container>
)

export default Layout
