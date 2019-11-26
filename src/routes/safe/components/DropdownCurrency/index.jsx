// @flow
import React, { useState } from 'react'
import { withStyles } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { useDispatch, useSelector } from 'react-redux'
import Menu, { MenuProps } from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import { currencyValuesListSelector } from '~/logic/currencyValues/store/selectors'

const styles = () => ({
  dropdownContainer: {

  },
})

const DropdownCurrency = ({
  classes,
}: Props) => {
  const currencyPairList = useSelector(currencyValuesListSelector)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentCurrency, setCurrentCurrency] = useState('USD')

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
    <div className={classes.dropdownContainer}>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        color="primary"
        onClick={handleClick}
        variant="contained"
      >
        {currentCurrency}
      </Button>
      <Menu
        anchorEl={anchorEl}
        elevation={0}
        getContentAnchorEl={null}
        id="customizedMenu"
        keepMounted
        onClose={handleClose}
        open={Boolean(anchorEl)}
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
          <MenuItem key={dropdownValue.currencyName} value={dropdownValue.currencyName} onClick={() => onCurrentCurrencyChangedHandler(dropdownValue.currencyName)}>
            <ListItemIcon>
              <div>ICO - </div>
            </ListItemIcon>
            <ListItemText primary={dropdownValue.currencyName} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default withStyles(styles)(DropdownCurrency)
