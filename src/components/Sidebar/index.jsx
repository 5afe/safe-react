// @flow
import * as React from 'react'
import Drawer from '@material-ui/core/Drawer'
import useSidebarStyles from './style'

const { useState } = React

type TSidebarContext = {
  isOpen: boolean,
  toggleSidebar: Function,
}

export const SidebarContext = React.createContext<TSidebarContext>({
  isOpen: false,
  toggleSidebar: () => {},
})

type SidebarProps = {
  children: React.Node,
}

const Sidebar = ({ children }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
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
