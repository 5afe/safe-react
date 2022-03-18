import InputBase from '@material-ui/core/InputBase'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiThemeProvider } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import classNames from 'classnames'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CheckIcon from './img/check.svg'

import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { useDropdownStyles } from 'src/routes/safe/components/CurrencyDropdown/style'
import { availableCurrenciesSelector, currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { DropdownListTheme } from 'src/theme/mui'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import Img from 'src/components/layout/Img/index'
import { getNativeCurrency } from 'src/config'
import { sameString } from 'src/utils/strings'
import { fetchSafeTokens } from 'src/logic/tokens/store/actions/fetchSafeTokens'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { Button } from '@material-ui/core'

export const CurrencyDropdown = ({ testId }: { testId: string }): React.ReactElement | null => {
  const dispatch = useDispatch()
  const nativeCurrency = getNativeCurrency()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const selectedCurrency = useSelector(currentCurrencySelector)
  const { address } = useSelector(currentSafe)
  const [searchParams, setSearchParams] = useState('')
  const currenciesList = useSelector(availableCurrenciesSelector)
  const tokenImage = nativeCurrency.logoUri
  const classes = useDropdownStyles({})
  const currenciesListFiltered = currenciesList.filter((currency) =>
    currency.toLowerCase().includes(searchParams.toLowerCase()),
  )

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    import('currency-flags/dist/currency-flags.min.css' as string)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onCurrentCurrencyChangedHandler = (newCurrencySelectedName: string): void => {
    handleClose()
    dispatch(fetchSafeTokens(address, newCurrencySelectedName))
    dispatch(setSelectedCurrency({ selectedCurrency: newCurrencySelectedName }))
  }

  if (!selectedCurrency) {
    return null
  }

  return (
    <MuiThemeProvider theme={DropdownListTheme}>
      <>
        <Button
          className={classes.button}
          onClick={handleClick}
          type="button"
          variant="outlined"
          data-testid={`${testId}-btn`}
        >
          <span className={classNames(classes.buttonInner, anchorEl && classes.openMenuButton)}>
            {selectedCurrency}
          </span>
        </Button>
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
          TransitionProps={{ mountOnEnter: true, unmountOnExit: true }}
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
                  {sameString(currencyName, nativeCurrency.symbol) ? (
                    <Img
                      alt={nativeCurrency.symbol.toLocaleLowerCase()}
                      onError={setImageToPlaceholder}
                      src={tokenImage}
                      className={classNames(classes.etherFlag)}
                    />
                  ) : (
                    <div
                      className={classNames(
                        classes.localFlag,
                        'currency-flag',
                        'currency-flag-lg',
                        `currency-flag-${currencyName.toLowerCase()}`,
                      )}
                    />
                  )}
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
