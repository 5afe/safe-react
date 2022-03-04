import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { primaryLite, primaryActive, smallFontSize } from 'src/theme/variables'
import { currentSafe } from 'src/logic/safe/store/selectors'

const Container = styled.div`
  background: ${primaryLite};
  color: ${primaryActive};
  font-size: ${smallFontSize};
  font-weight: bold;
  border-radius: 100%;
  padding: 4px;
  position: absolute;
  z-index: 2;
  top: -6px;
  left: 50%;
  transform: translateX(-110%);
`

const Threshold = (): React.ReactElement | null => {
  const { owners, threshold } = useSelector(currentSafe)
  if (!threshold) return null

  return (
    <Container>
      {threshold}/{owners.length}
    </Container>
  )
}

export default Threshold
