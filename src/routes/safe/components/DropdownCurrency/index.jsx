// @flow
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React, { useState } from 'react'
import style from 'currency-flags/dist/currency-flags.min.css'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { DropdownListTheme } from '~/theme/mui'
import { currencyValuesListSelector } from '~/logic/currencyValues/store/selectors'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import CheckIcon from './img/check.svg'

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
})

const DropdownCurrency = () => {
  const currencyPairList = useSelector(currencyValuesListSelector)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentCurrency, setCurrentCurrency] = useState('USD')
  const classes = useStyles()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onCurrentCurrencyChangedHandler = (newCurrencySelectedName) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const currencyPairListIterator of currencyPairList) {
      const { currencyName } = currencyPairListIterator

      if (currencyName === newCurrencySelectedName) {
        dispatch(setCurrencySelected(currencyPairListIterator))
        break
      }
    }

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
          rounded={0}
          getContentAnchorEl={null}
          id="customizedMenu"
          keepMounted
          onClose={handleClose}
          open={Boolean(anchorEl)}
          square
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'bottom',
          }}
          transformOrigin={{
            horizontal: 'center',
            vertical: 'top',
          }}
        >
          {currencyPairList.valueSeq().map((dropdownValue) => (
            <MenuItem className={classes.listItem} key={dropdownValue.currencyName} value={dropdownValue.currencyName} onClick={() => onCurrentCurrencyChangedHandler(dropdownValue.currencyName)}>
              <ListItemIcon className={classes.iconLeft}>
                <div className={`${classes.localFlag} ${style['currency-flag']} ${style['currency-flag-lg']} ${style[`currency-flag-${dropdownValue.currencyName.toLowerCase()}`]}`} />
              </ListItemIcon>
              <ListItemText primary={dropdownValue.currencyName} />
              {dropdownValue.currencyName === currentCurrency ? <ListItemIcon className={classes.iconRight}><img src={CheckIcon} alt="" /></ListItemIcon> : null}
            </MenuItem>
          ))}
        </Menu>
      </>
    </MuiThemeProvider>
  )
}

export default DropdownCurrency
