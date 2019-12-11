// @flow
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useState } from 'react'
import style from 'currency-flags/dist/currency-flags.min.css'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { DropdownListTheme } from '~/theme/mui'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import CheckIcon from './img/check.svg'
import { AVAILABLE_CURRENCIES } from '~/logic/currencyValues/store/model/currencyValues'
import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'

const buttonWidth = '140px'
const useStyles = makeStyles({
  listItem: {
    minWidth: buttonWidth,
  },
  localFlag: {
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: '20px !important',
    width: '26px !important',
  },
  iconLeft: {
    marginRight: '10px',
  },
  iconRight: {
    marginLeft: '18px',
  },
  button: {
    backgroundColor: '#e8e7e6',
    border: 'none',
    borderRadius: '3px',
    boxSizing: 'border-box',
    color: '#5d6d74',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'normal',
    height: '24px',
    lineHeight: '1.33',
    marginRight: '20px',
    minWidth: buttonWidth,
    outline: 'none',
    padding: '0',
    textAlign: 'left',
    '&:active': {
      opacity: '0.8',
    },
  },
  buttonInner: {
    boxSizing: 'border-box',
    display: 'block',
    height: '100%',
    lineHeight: '24px',
    padding: '0 22px 0 8px',
    position: 'relative',
    width: '100%',
    '&::after': {
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid #5d6d74',
      content: '""',
      height: '0',
      position: 'absolute',
      right: '8px',
      top: '9px',
      width: '0',
    },
  },
  openMenuButton: {
    '&::after': {
      borderBottom: '5px solid #5d6d74',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: 'none',
    },
  },
  dropdown: {
    maxHeight: '300px',
  },
})

const DropdownCurrency = () => {
  const currenciesList = Object.values(AVAILABLE_CURRENCIES)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentCurrency, setCurrentCurrency] = useState(AVAILABLE_CURRENCIES.USD)
  const classes = useStyles()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onCurrentCurrencyChangedHandler = (newCurrencySelectedName: AVAILABLE_CURRENCIES) => {
    dispatch(fetchCurrencySelectedValue(newCurrencySelectedName))
    dispatch(setCurrencySelected(newCurrencySelectedName))
    setCurrentCurrency(newCurrencySelectedName)
    handleClose()
  }


  return (
    <MuiThemeProvider theme={DropdownListTheme}>
      <>
        <button
          className={classes.button}
          onClick={handleClick}
          type="button"
        >
          <span className={`${classes.buttonInner} ${anchorEl ? classes.openMenuButton : ''}`}>
            {currentCurrency}
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
          className={classes.dropdown}
        >
          {currenciesList.map((currencyName) => (
            <MenuItem
              className={classes.listItem}
              key={currencyName}
              value={currencyName}
              onClick={() => onCurrentCurrencyChangedHandler(currencyName)}
            >
              <ListItemIcon className={classes.iconLeft}>
                <div
                  className={`${classes.localFlag} ${style['currency-flag']} ${style['currency-flag-lg']} ${style[`currency-flag-${currencyName.toLowerCase()}`]}`}
                />
              </ListItemIcon>
              <ListItemText primary={currencyName} />
              {currencyName === currentCurrency
                ? <ListItemIcon className={classes.iconRight}><img src={CheckIcon} alt="" /></ListItemIcon> : null}
            </MenuItem>
          ))}
        </Menu>
      </>
    </MuiThemeProvider>
  )
}

export default DropdownCurrency
