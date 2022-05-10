import { ReactElement, SyntheticEvent, useCallback } from 'react'
import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'
import { Box, IconButton } from '@material-ui/core'
import { Link, generatePath } from 'react-router-dom'
import { Icon } from '@gnosis.pm/safe-react-components'
import { GENERIC_APPS_ROUTE } from 'src/routes/routes'
import { md, lg } from 'src/theme/variables'
import appsIconSvg from 'src/assets/icons/apps.svg'
import { Card } from 'src/components/Dashboard/styled'

export const CARD_HEIGHT = 200
export const CARD_PADDING = 24

const StyledLink = styled(Link)`
  text-decoration: none;
`

const StyledLogo = styled.img`
  display: block;
  width: auto;
  height: 60px;
  margin-bottom: ${md};
`

const IconBtn = styled(IconButton)`
  &.MuiButtonBase-root {
    position: absolute;
    top: ${lg};
    right: ${lg};
    z-index: 10;
    padding: 8px;
  }

  svg {
    width: 16px;
    height: 16px;
    padding-left: 2px;
  }
`

type CardProps = {
  name: string
  description: string
  logoUri: string
  appUri: string
  isPinned: boolean
  onPin: () => void
}

const DashboardAppCard = (props: CardProps): ReactElement => {
  const appRoute = generatePath(GENERIC_APPS_ROUTE) + `?appUrl=${props.appUri}`
  const { isPinned, onPin } = props

  const handlePinClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onPin()
    },
    [onPin],
  )

  const setAppImageFallback = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
    error.currentTarget.onerror = null
    error.currentTarget.src = appsIconSvg
  }

  return (
    <StyledLink to={appRoute}>
      <Card>
        <StyledLogo src={props.logoUri} alt={`${props.name} logo`} onError={setAppImageFallback} />

        <Box mb={1}>
          <Text size="xl" strong>
            {props.name}
          </Text>
        </Box>

        <Text size="lg" color="inputFilled">
          {props.description}
        </Text>

        <IconBtn onClick={handlePinClick}>
          {isPinned ? <Icon type="bookmarkFilled" size="md" color="primary" /> : <Icon type="bookmark" size="md" />}
        </IconBtn>
      </Card>
    </StyledLink>
  )
}

export default DashboardAppCard
