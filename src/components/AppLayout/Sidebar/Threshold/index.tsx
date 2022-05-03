import styled from 'styled-components'

import { primaryLite, primaryActive } from 'src/theme/variables'

const Container = styled.div<{ size: number }>`
  background: ${primaryLite};
  color: ${primaryActive};
  font-size: ${(p) => p.size}px;
  font-weight: bold;
  border-radius: 100%;
  padding: 0.25em;
  position: absolute;
  z-index: 2;
  top: -8px;
  left: -8px;
  min-width: 1.5em;
  min-height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
`

type ThresholdProps = {
  threshold: number
  owners: number
  size?: number
}

const Threshold = ({ threshold, owners, size = 12 }: ThresholdProps): React.ReactElement | null => {
  return (
    <Container size={size}>
      {threshold}/{owners}
    </Container>
  )
}

export default Threshold
