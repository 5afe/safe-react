import { useState, ReactElement, createContext } from 'react'
import Drawer from '@material-ui/core/Drawer'
import { useSelector } from 'react-redux'

import { SafeList } from './SafeList'
import { sortedSafeListSelector } from './selectors'
import useSidebarStyles from './style'

import Hairline from 'src/components/layout/Hairline'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import AddSafeButton from 'src/components/SafeListSidebar/AddSafeButton'
import { safeAddressFromUrl } from 'src/utils/router'

export const SafeListSidebarContext = createContext({
  isOpen: false,
  toggleSidebar: () => {},
})

type Props = {
  children: ReactElement
}

export const SafeListSidebar = ({ children }: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const safes = useSelector(sortedSafeListSelector).filter((safe) => !safe.loadedViaUrl)
  const ownedSafes = useOwnerSafes()
  const safeAddress = safeAddressFromUrl()

  const classes = useSidebarStyles()
  const { trackEvent } = useAnalytics()

  const toggleSidebar = () => {
    if (!isOpen) {
      trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Safe List Sidebar' })
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

        <SafeList currentSafeAddress={safeAddress} onSafeClick={toggleSidebar} safes={safes} ownedSafes={ownedSafes} />
      </Drawer>
      {children}
    </SafeListSidebarContext.Provider>
  )
}
