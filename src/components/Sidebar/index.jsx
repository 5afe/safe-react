// @flow
import React, { useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import useSidebarStyles from './style'

export const SidebarContext = React.createContext({
  isOpen: false,
  toggleSidebar: () => {},
})

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const classes = useSidebarStyles()

  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      <Drawer
        className={classes.sidebar}
        open={isOpen}
        onKeyDown={toggleSidebar}
        classes={{ paper: classes.sidebarPaper }}
      >
        <div className={classes.headerPlaceholder} />
        Wop
      </Drawer>
      {children}
    </SidebarContext.Provider>
  )
}

export default Sidebar
