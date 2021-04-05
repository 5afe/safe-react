import { Button, Text, Card, Icon } from '@gnosis.pm/safe-react-components'
import { fade } from '@material-ui/core/styles/colorManipulator'
import styled from 'styled-components'
import React, { ReactElement } from 'react'
import { MobileView } from 'react-device-detect'

import Phone from 'src/components/AppLayout/MobileStart/assets/phone@2x.png'

const Overlay = styled.div`
  display: block;
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => fade(theme.colors.overlay.color, 0.75)};
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
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.separator};
    border-radius: 16px;
    padding: 4px;
    box-sizing: border-box;
  }

  @media (max-width: 340px) {
    margin: 8px 34px 0 16px;
  }
`
const StyledButton = styled(Button)`
  background-color: transparent;
  min-width: 0;

  :hover {
    background-color: transparent;
  }
`

const StyledLink = styled.a`
  text-decoration: none;
`

type Props = {
  onClose: () => void
}

export const MobileNotSupported = ({ onClose }: Props): ReactElement => {
  return (
    <MobileView>
      <Overlay>
        <ModalApp>
          <StyledCard>
            <Text size="lg">The Gnosis Safe web app is not optimized for mobile.</Text>
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
          <StyledButton size="md" variant="outlined" color="primary" onClick={onClose}>
            <StyledCloseIcon size="md" type="cross" />
          </StyledButton>
        </ModalApp>
      </Overlay>
    </MobileView>
  )
}
