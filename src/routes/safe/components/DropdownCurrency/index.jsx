// @flow
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useState } from 'react'
import style from 'currency-flags/dist/currency-flags.min.css'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import classNames from 'classnames'
import { DropdownListTheme } from '~/theme/mui'
import CheckIcon from './img/check.svg'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { currentCurrencySelector } from '~/logic/currencyValues/store/selectors'
import { useDropdownStyles } from '~/routes/safe/components/DropdownCurrency/style'
import saveCurrencySelected from '~/logic/currencyValues/store/actions/saveCurrencySelected'

const DropdownCurrency = () => {
  const currenciesList = Object.values(AVAILABLE_CURRENCIES)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const currencyValueSelected = useSelector(currentCurrencySelector)

  const [searchParams, setSearchParams] = useState('')
  const classes = useDropdownStyles()
  const currenciesListFiltered = currenciesList.filter(currency =>
    currency.toLowerCase().includes(searchParams.toLowerCase()),
  )

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onCurrentCurrencyChangedHandler = (newCurrencySelectedName: AVAILABLE_CURRENCIES) => {
    dispatch(fetchCurrencySelectedValue(newCurrencySelectedName))
    dispatch(saveCurrencySelected(newCurrencySelectedName))
    handleClose()
  }

  return !currencyValueSelected ? null : (
    <MuiThemeProvider theme={DropdownListTheme}>
      <>
        <button className={classes.button} onClick={handleClick} type="button">
          <span className={classNames(classes.buttonInner, anchorEl && classes.openMenuButton)}>
            {currencyValueSelected}
          </span>
        </button>
        <Menu
          anchorEl={anchorEl}
          elevation={0}
          getContentAnchorEl={null}
          id="customizedMenu"
          keepMounted
          onClose={handleClose}
          open={Boolean(anchorEl)}
          rounded={0}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
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
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={event => setSearchParams(event.target.value)}
                value={searchParams}
              />
            </div>
          </MenuItem>
          <div className={classes.dropdownItemsScrollWrapper}>
            {currenciesListFiltered.map(currencyName => (
              <MenuItem
                className={classes.listItem}
                key={currencyName}
                value={currencyName}
                onClick={() => onCurrentCurrencyChangedHandler(currencyName)}
              >
                <ListItemIcon className={classes.iconLeft}>
                  <div
                    className={classNames(
                      classes.localFlag,
                      style['currency-flag'],
                      style['currency-flag-lg'],
                      style[`currency-flag-${currencyName.toLowerCase()}`],
                    )}
                  />
                </ListItemIcon>
                <ListItemText primary={currencyName} />
                {currencyName === currencyValueSelected ? (
                  <ListItemIcon className={classes.iconRight}>
                    <img src={CheckIcon} alt="checked" />
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

export default DropdownCurrency
