import styled, { keyframes } from 'styled-components'

export const gradientSK = keyframes`
0% {
  background-position: 0% 54%;
}
50% {
  background-position: 100% 47%;
}
100% {
  background-position: 0% 54%;
}
`

export const SafeAppLogoSK = styled.div`
  height: ${(props: { size }) => (props.size === 'lg' ? '112px' : '50px')};
  width: ${(props: { size }) => (props.size === 'lg' ? '112px' : '50px')};
  border-radius: 50%;
  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;
  animation: ${gradientSK} 1.5s ease infinite;
`

export const SafeAppTitleSK = styled.div`
  height: 18px;
  width: 160px;
  margin: 8px 0;

  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;
  animation: ${gradientSK} 1.5s ease infinite;
`

export const SafeAppDescriptionSK = styled.div`
  height: 12px;
  width: 240px;
  margin: 2px 0;

  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;
  animation: ${gradientSK} 1.5s ease infinite;
`
