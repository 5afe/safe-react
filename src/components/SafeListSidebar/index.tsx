import { useState, ReactElement, createContext } from 'react'
import Drawer from '@material-ui/core/Drawer'

import { SafeList } from './SafeList'
import useSidebarStyles from './style'
import Hairline from 'src/components/layout/Hairline'
import AddSafeButton from 'src/components/SafeListSidebar/AddSafeButton'
import { trackEvent } from 'src/utils/googleTagManager'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'

export const SafeListSidebarContext = createContext({
  isOpen: false,
  toggleSidebar: () => {},
})

type Props = {
  children: ReactElement
}

export const SafeListSidebar = ({ children }: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)

  const classes = useSidebarStyles()

  const toggleSidebar = () => {
    trackEvent({ ...OVERVIEW_EVENTS.SIDEBAR, label: isOpen ? 'Close' : 'Open' })
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  const handleEsc = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      toggleSidebar()
    }
  }

  return (
    <SafeListSidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      <Drawer
        classes={{ paper: `${classes.sidebarPaper} safe-list-sidebar` }}
        className={classes.sidebar}
        ModalProps={{ onClose: toggleSidebar }}
        onKeyDown={handleEsc}
        open={isOpen}
      >
        <AddSafeButton onAdd={toggleSidebar} />

        <Hairline />

        <SafeList onSafeClick={toggleSidebar} />
      </Drawer>
      {children}
    </SafeListSidebarContext.Provider>
  )
}
