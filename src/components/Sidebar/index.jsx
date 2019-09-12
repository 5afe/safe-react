// @flow
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  return <Drawer open={isOpen} onKeyDown={toggleSidebar}>Wop</Drawer>
}

export default Sidebar
