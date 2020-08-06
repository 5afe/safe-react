import CollapseMUI from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div``

const HeaderWrapper = styled.div``

const TitleWrapper = styled.div``

const Header = styled.div`
  display: flex;
  align-items: center;
`

interface Collapse {
  title: React.ReactElement | string
  description?: React.ReactElement | string
  collapseClassName?: string
  headerWrapperClassName?: string
}

const Collapse: React.FC<Collapse> = ({
  children,
  description = null,
  title,
  collapseClassName,
  headerWrapperClassName,
}): React.ReactElement => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <Wrapper>
      <HeaderWrapper className={headerWrapperClassName} onClick={handleClick}>
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
