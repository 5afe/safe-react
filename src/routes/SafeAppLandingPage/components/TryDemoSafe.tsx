import { MouseEvent, ReactElement } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Title, Button } from '@gnosis.pm/safe-react-components'

import { demoSafeRoute } from 'src/routes/routes'
import { secondary } from 'src/theme/variables'
import DemoSvg from 'src/assets/icons/demo.svg'
import { trackEvent } from 'src/utils/googleTagManager'
import { SAFE_APPS_EVENTS } from 'src/utils/events/safeApps'

const TryDemoSafe = ({ safeAppUrl }: { safeAppUrl: string | null }): ReactElement => {
  const history = useHistory()
  const demoSafeUrl = `${demoSafeRoute}?appUrl=${encodeURI(safeAppUrl || '')}`

  const handleDemoSafeClick = (event: MouseEvent) => {
    event.preventDefault()

    trackEvent({ ...SAFE_APPS_EVENTS.SHARED_APP_OPEN_DEMO, label: safeAppUrl })
    history.push(demoSafeUrl)
  }

  return (
    <SafeDemoContainer>
      <Title size="xs">Want to try the app before using it?</Title>

      <img alt="Demo" height={92} src={DemoSvg} />

      {safeAppUrl && (
        <StyledDemoButton
          onClick={handleDemoSafeClick}
          to={demoSafeUrl}
          color="primary"
          component={Link}
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
