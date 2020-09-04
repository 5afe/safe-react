import InputBase from '@material-ui/core/InputBase'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiThemeProvider } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import classNames from 'classnames'
import React from 'react'
import { useField, useFormState } from 'react-final-form'
import { AbiItem } from 'web3-utils'

import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { NO_CONTRACT } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import CheckIcon from 'src/routes/safe/components/CurrencyDropdown/img/check.svg'
import { useDropdownStyles } from 'src/routes/safe/components/CurrencyDropdown/style'
import { DropdownListTheme } from 'src/theme/mui'
import { extractUsefulMethods, AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'

const MENU_WIDTH = '452px'

interface MethodsDropdownProps {
  onChange: (method: AbiItem) => void
}

const MethodsDropdown = ({ onChange }: MethodsDropdownProps): React.ReactElement | null => {
  const classes = useDropdownStyles({ buttonWidth: MENU_WIDTH })
  const {
    input: { value: abi },
    meta: { valid },
  } = useField('abi', { subscription: { value: true, valid: true } })
  const {
    initialValues: { selectedMethod: selectedMethodByDefault },
  } = useFormState({ subscription: { initialValues: true } })
  const [selectedMethod, setSelectedMethod] = React.useState(selectedMethodByDefault ? selectedMethodByDefault : {})
  const [methodsList, setMethodsList] = React.useState<AbiItemExtended[]>([])
  const [methodsListFiltered, setMethodsListFiltered] = React.useState<AbiItemExtended[]>([])
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [searchParams, setSearchParams] = React.useState('')

  React.useEffect(() => {
    if (abi) {
      try {
        setMethodsList(extractUsefulMethods(JSON.parse(abi)))
      } catch (e) {
        setMethodsList([])
      }
    }
  }, [abi])

  React.useEffect(() => {
    setMethodsListFiltered(methodsList.filter(({ name }) => name?.toLowerCase().includes(searchParams.toLowerCase())))
  }, [methodsList, searchParams])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onMethodSelectedChanged = (chosenMethod: AbiItem) => {
    setSelectedMethod(chosenMethod)
    onChange(chosenMethod)
    handleClose()
  }

  return !valid || !abi || abi === NO_CONTRACT ? null : (
    <Row margin="sm">
      <Col>
        <MuiThemeProvider theme={DropdownListTheme}>
          <>
            <button className={classes.button} onClick={handleClick} type="button">
              <span className={classNames(classes.buttonInner, anchorEl && classes.openMenuButton)}>
                {(selectedMethod as Record<string, string>).name}
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
              open={!!anchorEl}
              PaperProps={{ style: { width: MENU_WIDTH } }}
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
                {methodsListFiltered.map((method) => {
                  const { action, name, signatureHash } = method

                  return (
                    <MenuItem
                      className={classes.listItem}
                      key={signatureHash}
                      onClick={() => onMethodSelectedChanged(method)}
                      value={signatureHash}
                    >
                      <ListItemText primary={name} />
                      <ListItemIcon className={classes.iconRight}>
                        {signatureHash === (selectedMethod as Record<string, string>).signatureHash ? (
                          <img alt="checked" src={CheckIcon} />
                        ) : (
                          <span />
                        )}
                      </ListItemIcon>
                      <ListItemIcon className={classes.iconRight}>
                        <div>{action}</div>
                      </ListItemIcon>
                    </MenuItem>
                  )
                })}
              </div>
            </Menu>
          </>
        </MuiThemeProvider>
      </Col>
    </Row>
  )
}

export default MethodsDropdown
