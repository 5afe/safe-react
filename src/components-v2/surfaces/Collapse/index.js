// @flow
import React from 'react'
import styled from 'styled-components'
import CollapseMUI from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const Wrapper = styled.div``

const Header = styled.div`
  display: flex;
  align-items: center;
`

const Title = styled.div``

type Props = {
  title: string,
  children: React.Node,
  description: React.Node,
}

const Collapse = ({ title, description, children }: Props) => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Header>
        <IconButton disableRipple size="small" onClick={handleClick}>
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
