// @flow
import * as React from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import Drawer from '@material-ui/core/Drawer'
import { type Safe } from '~/routes/safe/store/models/safe'
import { safesListSelector } from '~/routes/safeList/store/selectors'
import useSidebarStyles from './style'
import SafeList from './SafeList'

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
  safes: List<Safe>,
}

const Sidebar = ({ children, safes }: SidebarProps) => {
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
        onClick={toggleSidebar}
        classes={{ paper: classes.sidebarPaper }}
      >
        <div className={classes.headerPlaceholder} />
        <SafeList safes={safes} />
      </Drawer>
      {children}
    </SidebarContext.Provider>
  )
}

export default connect<Object, Object, ?Function, ?Object>(
  // $FlowFixMe
  (state) => ({ safes: safesListSelector(state) }),
  null,
)(Sidebar)
