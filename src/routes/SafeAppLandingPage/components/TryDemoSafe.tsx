import { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Title, Button } from '@gnosis.pm/safe-react-components'

import { demoSafeRoute } from 'src/routes/routes'
import { secondary } from 'src/theme/variables'
import DemoSvg from 'src/assets/icons/demo.svg'

const TryDemoSafe = ({ safeAppUrl }: { safeAppUrl: string | null }): ReactElement => {
  return (
    <SafeDemoContainer>
      <Title size="xs">Want to try the app before using it?</Title>

      <img alt="Demo" height={92} src={DemoSvg} />

      {safeAppUrl && (
        <StyledDemoButton
          color="primary"
          component={Link}
          to={`${demoSafeRoute}?appUrl=${encodeURI(safeAppUrl)}`}
          size="lg"
          variant="outlined"
        >
          Try Demo
        </StyledDemoButton>
      )}
    </SafeDemoContainer>
  )
}

export default TryDemoSafe

const SafeDemoContainer = styled.div`
  flex: 1 0 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledDemoButton = styled(Button)`
  border: 2px solid ${secondary};
  margin-top: 30px;
`
