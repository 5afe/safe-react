import React, { useEffect, useMemo, useState, ReactElement } from 'react'
import Drawer from '@material-ui/core/Drawer'
import SearchIcon from '@material-ui/icons/Search'
import SearchBar from 'material-ui-search-bar'
import { useSelector } from 'react-redux'

import { SafeList } from './SafeList'
import { sortedSafeListSelector } from './selectors'
import useSidebarStyles from './style'

import Spacer from 'src/components/Spacer'
import Button from 'src/components/layout/Button'
import Divider from 'src/components/layout/Divider'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import Row from 'src/components/layout/Row'
import { WELCOME_ADDRESS } from 'src/routes/routes'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'

import { defaultSafeSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'

export const SafeListSidebarContext = React.createContext({
  isOpen: false,
  toggleSidebar: () => {},
})

const filterBy = (filter, safes) =>
  safes.filter(
    (safe) =>
      !filter ||
      safe.address.toLowerCase().includes(filter.toLowerCase()) ||
      safe.name.toLowerCase().includes(filter.toLowerCase()),
  )

type Props = {
  children: ReactElement
}

export const SafeListSidebar = ({ children }: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const safes = useSelector(sortedSafeListSelector).filter((safe) => !safe.loadedViaUrl)
  const defaultSafe = useSelector(defaultSafeSelector)
  const currentSafe = useSelector(safeParamAddressFromStateSelector)

  const classes = useSidebarStyles()
  const { trackEvent } = useAnalytics()

  const searchClasses = {
    input: classes.searchInput,
    root: classes.searchRoot,
    iconButton: classes.searchIconInput,
    searchContainer: classes.searchContainer,
  }

  const toggleSidebar = () => {
    if (!isOpen) {
      trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Safe List Sidebar' })
    }
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  const handleFilterChange = (value) => {
    setFilter(value)
  }

  const handleFilterCancel = () => {
    setFilter('')
  }

  const handleEsc = (e) => {
    if (e.keyCode === 27) {
      toggleSidebar()
    }
  }

  const filteredSafes = useMemo(() => filterBy(filter, safes), [safes, filter])
  useEffect(() => {
    setTimeout(() => {
      setFilter('')
    }, 300)
  }, [isOpen])

  return (
    <SafeListSidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      <Drawer
        classes={{ paper: classes.sidebarPaper }}
        className={classes.sidebar}
        ModalProps={{ onBackdropClick: toggleSidebar }}
        onKeyDown={handleEsc}
        open={isOpen}
      >
        <Row align="center" className={classes.topComponents}>
          <Row align="center" className={classes.searchWrapper}>
            <SearchIcon className={classes.searchIcon} />
            <SearchBar
              classes={searchClasses}
              onCancelSearch={handleFilterCancel}
              onChange={handleFilterChange}
              placeholder="Search by name or address"
              searchIcon={<div />}
              value={filter}
            />
          </Row>
          <Divider className={classes.divider} />
          <Spacer className={classes.spacer} />
          <Button
            className={classes.addSafeBtn}
            color="primary"
            component={Link}
            onClick={toggleSidebar}
            size="small"
            to={WELCOME_ADDRESS}
            variant="contained"
          >
            + Add Safe
          </Button>
          <Spacer />
        </Row>
        <Hairline />
        <SafeList
          currentSafe={currentSafe}
          defaultSafe={defaultSafe}
          onSafeClick={toggleSidebar}
          safes={filteredSafes}
        />
      </Drawer>
      {children}
    </SafeListSidebarContext.Provider>
  )
}
