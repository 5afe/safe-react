import React from 'react'
import styled from 'styled-components'
import { ListItemType } from 'src/components/List'

import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { screenMd } from 'src/theme/variables'
import { Button, Card, Icon, Text } from '@gnosis.pm/safe-react-components'
import Phone from './MobileStart/assets/phone@2x.png'
import { rgba } from 'polished'
import { MobileView } from 'react-device-detect'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.background};

  /* @media (max-width: ${screenMd}px) {
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
const Overlay = styled.div`
  display: block;
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => rgba(theme.colors.overlay.color, 0.75)};
  z-index: 2147483009; /* on top of Intercom Button */
`

const ModalApp = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  width: 100vw;
  height: 260px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 1px 2px 10px rgba(40, 54, 61, 0.18);
  z-index: 2147483004; /* on top of Intercom Button */
  padding: 20px 16px 0 16px;
`

const StyledCard = styled(Card)`
  background-color: #fdfdfd;
  /*   width: 45vw; */
  min-width: 245px;
  height: 220px;
  padding: 24px 58px 24px 24px;
  box-sizing: border-box;
  box-shadow: none;
  display: flex;
  justify-content: space-around;
  flex-direction: column;

  @media (max-width: 340px) {
    padding: 16px;
    min-width: 215px;
  }
`
const StyledImg = styled.img`
  margin: 24px -81px 0 -58px;
  z-index: 1;
  width: 45%;
  height: auto;
  object-fit: cover;

  @media (max-width: 340px) {
    display: none;
  }

  @media (min-width: 430px) {
    width: 30%;
  }

  @media (min-width: 720px) {
    width: 25%;
  }

  @media (min-width: 800px) {
    width: 20%;
  }
`

const StyledCloseIcon = styled(Icon)`
  margin: 0 34px;
  width: 32px;
  height: 32px;

  &:hover {
    background: ${({ theme }) => theme.colors.separator};
    border-radius: 16px;
  }

  @media (max-width: 340px) {
    margin: 8px 34px 0 16px;
  }
`
const StyledLink = styled.a`
  text-decoration: none;
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
  /* onClose: () => void */
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
  /* onClose, */
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
    <MobileView>
      <Overlay>
        <ModalApp>
          <StyledCard>
            <Text size="lg">The Safe Multisig web app is not optimized for mobile.</Text>
            <Text size="lg">Get the mobile app for a better experience.</Text>
            <Button size="md" color="primary" variant="contained">
              <StyledLink target="_blank" href="https://gnosis-safe.io/#mobile" rel="noopener noreferrer">
                <Text color="white" size="xl">
                  Get the App
                </Text>
              </StyledLink>
            </Button>
          </StyledCard>

          <StyledImg src={Phone} alt="Phone" />
          {/* <Button onClick={onClose}>*/}
          <StyledCloseIcon size="md" type="cross" />
          {/* </Button>  */}
        </ModalApp>
      </Overlay>
    </MobileView>
  </Container>
)

export default Layout
