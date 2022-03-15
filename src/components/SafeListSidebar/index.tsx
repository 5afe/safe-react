import { useState, ReactElement, createContext } from 'react'
import Drawer from '@material-ui/core/Drawer'

import { SafeList } from './SafeList'
import useSidebarStyles from './style'
import Hairline from 'src/components/layout/Hairline'
import AddSafeButton from 'src/components/SafeListSidebar/AddSafeButton'
import { trackEvent } from 'src/utils/googleTagManager'
import { SAFE_OVERVIEW_EVENTS } from 'src/utils/events/safeOverview'

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
    if (!isOpen) {
      trackEvent(SAFE_OVERVIEW_EVENTS.OPEN_SIDEBAR)
    }
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
        classes={{ paper: classes.sidebarPaper }}
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
