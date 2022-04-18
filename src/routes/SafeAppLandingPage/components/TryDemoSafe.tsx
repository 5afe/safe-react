import { ReactElement } from 'react'
import styled from 'styled-components'
import { Title, Button } from '@gnosis.pm/safe-react-components'

import { demoSafeRoute } from 'src/routes/routes'
import { secondary } from 'src/theme/variables'
import DemoSvg from 'src/assets/icons/demo.svg'
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'

const TryDemoSafe = ({ safeAppUrl }: { safeAppUrl: string | null }): ReactElement => {
  return (
    <SafeDemoContainer>
      <Title size="xs">Want to try the app before using it?</Title>

      <BodyImage>
        <Img alt="Demo" height={92} src={DemoSvg} />
      </BodyImage>
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
  text-align: center;
`

const BodyImage = styled.div`
  margin: 30px 0;
`

const StyledDemoButton = styled(Button)`
  border: 2px solid ${secondary};
`
