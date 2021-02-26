import styled, { keyframes } from 'styled-components'

const gradientSK = keyframes`
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

export const AppIconSK = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin: 0 auto;
  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;
  animation: ${gradientSK} 1.5s ease infinite;
`
export const TitleSK = styled.div`
  height: 24px;
  width: 160px;
  margin: 24px auto;
  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;
  animation: ${gradientSK} 1.5s ease infinite;
`
export const DescriptionSK = styled.div`
  height: 16px;
  width: 200px;
  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;
  animation: ${gradientSK} 1.5s ease infinite;
`
