import CollapseMUI from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0 3px;
  cursor: pointer;
  user-select: none;
`

const TitleWrapper = styled.div``

const Header = styled.div`
  display: flex;
  align-items: center;
`

interface CollapseProps {
  title: React.ReactElement | string
  description?: React.ReactElement | string
  collapseClassName?: string
}

const Collapse: React.FC<CollapseProps> = ({
  children,
  description = null,
  title,
  collapseClassName,
}): React.ReactElement => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <Wrapper>
      <HeaderWrapper onClick={handleClick}>
        <TitleWrapper>{title}</TitleWrapper>
        <Header>
          <IconButton disableRipple size="small">
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          {description}
        </Header>
      </HeaderWrapper>

      <CollapseMUI in={open} timeout="auto" unmountOnExit className={collapseClassName}>
        {children}
      </CollapseMUI>
    </Wrapper>
  )
}

export default Collapse
