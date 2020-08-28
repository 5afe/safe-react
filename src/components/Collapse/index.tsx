import CollapseMUI from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const Header = styled.div`
  display: flex;
  align-items: center;
`

const Title = styled.div``

const Collapse = ({ children, description, title }: any) => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Header>
        <IconButton disableRipple onClick={handleClick} size="small">
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        {description}
      </Header>

      <CollapseMUI in={open} timeout="auto" unmountOnExit>
        {children}
      </CollapseMUI>
    </Wrapper>
  )
}

export default Collapse
