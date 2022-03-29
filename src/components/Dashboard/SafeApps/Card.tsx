import { ReactElement } from 'react'
import styled from 'styled-components'
import { Text, Title } from '@gnosis.pm/safe-react-components'
import { Bookmark, BookmarkBorder } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'
import { Link } from 'react-router-dom'

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

const StyledFooter = styled.div`
  position: absolute;
  bottom: 24px;
`

type CardProps = {
  name: string
  description: string
  logoUri: string
  appUri: string
  isPinned?: boolean
}

const Card = (props: CardProps): ReactElement => {
  return (
    <StyledLink to="#">
      <StyledCard>
        <IconBtn>{props.isPinned ? <Bookmark /> : <BookmarkBorder />}</IconBtn>
        <StyledLogo src={props.logoUri} alt={`${props.name} logo`} />
        <Title size="xs">{props.name}</Title>
        <Text size="md" color="inputFilled">
          {props.description}
        </Text>
        <StyledFooter>Last used at:</StyledFooter>
      </StyledCard>
    </StyledLink>
  )
}

export default Card
