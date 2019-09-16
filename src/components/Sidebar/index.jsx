// @flow
import React, { useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import useSidebarStyles from './style'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const classes = useSidebarStyles()

  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  return (
    <Drawer
      className={classes.sidebar}
      open={isOpen}
      onKeyDown={toggleSidebar}
      classes={{ paper: classes.sidebarPaper }}
    >
      <div className={classes.headerPlaceholder} />
      Wop
    </Drawer>
  )
}

export default Sidebar
