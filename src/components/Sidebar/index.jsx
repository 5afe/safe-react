// @flow
import * as React from 'react'
import { List } from 'immutable'
import SearchBar from 'material-ui-search-bar'
import { connect } from 'react-redux'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Drawer from '@material-ui/core/Drawer'
import SearchIcon from '@material-ui/icons/Search'
import Divider from '~/components/layout/Divider'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import Spacer from '~/components/Spacer'
import Hairline from '~/components/layout/Hairline'
import Row from '~/components/layout/Row'
import { type Safe } from '~/routes/safe/store/models/safe'
import { safesListSelector, defaultSafeSelector } from '~/routes/safe/store/selectors'
import setDefaultSafe from '~/routes/safe/store/actions/setDefaultSafe'
import useSidebarStyles from './style'
import SafeList from './SafeList'
import { WELCOME_ADDRESS } from '~/routes/routes'

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
  setDefaultSafeAction: Function,
  defaultSafe: string,
}

const filterBy = (filter: string, safes: List<Safe>): List<Safe> => safes.filter(
  (safe: Safe) => !filter
      || safe.address.toLowerCase().includes(filter.toLowerCase())
      || safe.name.toLowerCase().includes(filter.toLowerCase()),
)

const Sidebar = ({
  children, safes, setDefaultSafeAction, defaultSafe,
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<string>('')
  const classes = useSidebarStyles()

  const searchClasses = {
    input: classes.searchInput,
    root: classes.searchRoot,
    iconButton: classes.searchIconInput,
    searchContainer: classes.searchContainer,
  }

  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const handleFilterCancel = () => {
    setFilter('')
  }

  const handleEsc = (e: SyntheticKeyboardEvent<*>) => {
    if (e.keyCode === 27) {
      toggleSidebar()
    }
  }

  const filteredSafes = filterBy(filter, safes)

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      <ClickAwayListener onClickAway={toggleSidebar}>
        <Drawer
          className={classes.sidebar}
          open={isOpen}
          onKeyDown={handleEsc}
          classes={{ paper: classes.sidebarPaper }}
          ModalProps={{ onBackdropClick: toggleSidebar }}
        >
          <div className={classes.headerPlaceholder} />
          <Row align="center">
            <SearchIcon className={classes.searchIcon} />
            <SearchBar
              classes={searchClasses}
              placeholder="Search by name or address"
              searchIcon={<div />}
              onChange={handleFilterChange}
              onCancelSearch={handleFilterCancel}
            />
            <Spacer />
            <Divider />
            <Spacer />
            <Button
              component={Link}
              to={WELCOME_ADDRESS}
              className={classes.addSafeBtn}
              variant="contained"
              size="small"
              color="primary"
              onClick={toggleSidebar}
            >
              + Add Safe
            </Button>
            <Spacer />
          </Row>
          <Hairline />
          <SafeList
            safes={filteredSafes}
            onSafeClick={toggleSidebar}
            setDefaultSafe={setDefaultSafeAction}
            defaultSafe={defaultSafe}
          />
        </Drawer>
      </ClickAwayListener>
      {children}
    </SidebarContext.Provider>
  )
}

export default connect<Object, Object, ?Function, ?Object>(
  // $FlowFixMe
  (state) => ({ safes: safesListSelector(state), defaultSafe: defaultSafeSelector(state) }),
  { setDefaultSafeAction: setDefaultSafe },
)(Sidebar)
