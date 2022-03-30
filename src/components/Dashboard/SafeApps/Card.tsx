import { ReactElement, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, Title } from '@gnosis.pm/safe-react-components'
import { Bookmark, BookmarkBorder } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import { Link, generatePath } from 'react-router-dom'
import { GENERIC_APPS_ROUTE } from 'src/routes/routes'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`

const StyledCard = styled.div`
  position: relative;
  width: 260px;
  height: 200px;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
`

const StyledLogo = styled.img`
  display: block;
  width: 60px;
  height: auto;
`

const IconBtn = styled(IconButton)`
  &.MuiButtonBase-root {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    padding: 5px;
  }

  svg {
    width: 16px;
    height: 16px;
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

const Card = (props: CardProps): ReactElement => {
  const appRoute = generatePath(GENERIC_APPS_ROUTE) + `?appUrl=${props.appUri}`
  const { isPinned, onPin } = props
  const [localPinned, setLocalPinned] = useState<boolean>(isPinned)

  const handlePinClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setLocalPinned((prev) => !prev)
    },
    [setLocalPinned],
  )

  useEffect(() => {
    if (localPinned === isPinned) return

    // Add a small delay when pinning/unpinning for visual feedback
    const delay = setTimeout(onPin, 500)
    return () => clearTimeout(delay)
  }, [localPinned, isPinned, onPin])

  return (
    <StyledLink to={appRoute}>
      <StyledCard>
        <StyledLogo src={props.logoUri} alt={`${props.name} logo`} />

        <Title size="xs">{props.name}</Title>

        <Text size="md" color="inputFilled">
          {props.description}
        </Text>

        {/* Bookmark button */}
        <IconBtn onClick={handlePinClick}>{localPinned ? <Bookmark /> : <BookmarkBorder />}</IconBtn>

        {/* TODO: Share button */}
      </StyledCard>
    </StyledLink>
  )
}

export default Card
