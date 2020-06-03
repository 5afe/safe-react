import InputBase from '@material-ui/core/InputBase'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiThemeProvider } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import classNames from 'classnames'
import 'currency-flags/dist/currency-flags.min.css'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CheckIcon from './img/check.svg'

import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { useDropdownStyles } from 'src/routes/safe/components/CurrencyDropdown/style'
import { safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { DropdownListTheme } from 'src/theme/mui'

const CurrencyDropdown = () => {
  const currenciesList = Object.values(AVAILABLE_CURRENCIES)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const selectedCurrency = useSelector(currentCurrencySelector)

  const [searchParams, setSearchParams] = useState('')
  const classes = useDropdownStyles()
  const currenciesListFiltered = currenciesList.filter((currency) =>
    currency.toLowerCase().includes(searchParams.toLowerCase()),
  )

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onCurrentCurrencyChangedHandler = (newCurrencySelectedName) => {
    dispatch(setSelectedCurrency(safeAddress, newCurrencySelectedName))
    handleClose()
  }

  return !selectedCurrency ? null : (
    <MuiThemeProvider theme={DropdownListTheme}>
      <>
        <button className={classes.button} onClick={handleClick} type="button">
          <span className={classNames(classes.buttonInner, anchorEl && classes.openMenuButton)}>
            {selectedCurrency}
          </span>
        </button>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          elevation={0}
          getContentAnchorEl={null}
          id="customizedMenu"
          keepMounted
          onClose={handleClose}
          open={Boolean(anchorEl)}
          transformOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
        >
          <MenuItem className={classes.listItemSearch} key="0">
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(event) => setSearchParams(event.target.value)}
                placeholder="Search…"
                value={searchParams}
              />
            </div>
          </MenuItem>
          <div className={classes.dropdownItemsScrollWrapper}>
            {currenciesListFiltered.map((currencyName) => (
              <MenuItem
                className={classes.listItem}
                key={currencyName}
                onClick={() => onCurrentCurrencyChangedHandler(currencyName)}
                value={currencyName}
              >
                <ListItemIcon className={classes.iconLeft}>
                  <div
                    className={classNames(
                      classes.localFlag,
                      'currency-flag',
                      'currency-flag-lg',
                      `currency-flag-${currencyName.toLowerCase()}`,
                    )}
                  />
                </ListItemIcon>
                <ListItemText primary={currencyName} />
                {currencyName === selectedCurrency ? (
                  <ListItemIcon className={classes.iconRight}>
                    <img alt="checked" src={CheckIcon} />
                  </ListItemIcon>
                ) : null}
              </MenuItem>
            ))}
          </div>
        </Menu>
      </>
    </MuiThemeProvider>
  )
}

export default CurrencyDropdown
