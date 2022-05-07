import InputBase from '@material-ui/core/InputBase'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiThemeProvider } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import classNames from 'classnames'
import { ReactElement, useEffect, useState } from 'react'
import { useField, useFormState } from 'react-final-form'
import { AbiItem } from 'web3-utils'

import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { NO_CONTRACT } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import CheckIcon from 'src/routes/safe/components/CurrencyDropdown/img/check.svg'
import { useDropdownStyles } from 'src/routes/safe/components/CurrencyDropdown/style'
import { DropdownListTheme } from 'src/theme/mui'
import { extractUsefulMethods, AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { Text } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { useButtonStyles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/MethodsDropdown/style'

const MENU_WIDTH = '452px'

const StyledText = styled(Text)`
  padding: 4px 0 0 8px;
`

interface MethodsDropdownProps {
  onChange: (method: AbiItem) => void
}

export const MethodsDropdown = ({ onChange }: MethodsDropdownProps): ReactElement | null => {
  const classes = useDropdownStyles({ buttonWidth: MENU_WIDTH })
  const buttonClasses = useButtonStyles({ buttonWidth: MENU_WIDTH })
  const {
    input: { value: abi },
    meta: { valid },
  } = useField('abi', { subscription: { value: true, valid: true } })
  const {
    initialValues: { selectedMethod: selectedMethodByDefault },
  } = useFormState({ subscription: { initialValues: true } })
  const [selectedMethod, setSelectedMethod] = useState(selectedMethodByDefault ? selectedMethodByDefault : {})
  const [methodsList, setMethodsList] = useState<AbiItemExtended[]>([])
  const [methodsListFiltered, setMethodsListFiltered] = useState<AbiItemExtended[]>([])

  const [anchorEl, setAnchorEl] = useState(null)
  const [searchParams, setSearchParams] = useState('')

  useEffect(() => {
    if (abi) {
      try {
        setMethodsList(extractUsefulMethods(JSON.parse(abi)))
      } catch (e) {
        setMethodsList([])
      }
    }
  }, [abi])

  useEffect(() => {
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

  if (!valid || !abi || abi === NO_CONTRACT) {
    return null
  }

  return (
    <Row margin="md">
      <Col>
        <MuiThemeProvider theme={DropdownListTheme}>
          <>
            <Button className={buttonClasses.button} onClick={handleClick} variant="outlined">
              <StyledText
                size="xl"
                color="placeHolder"
                className={classNames(buttonClasses.buttonInner, anchorEl && buttonClasses.openMenuButton)}
              >
                {(selectedMethod as Record<string, string>).name || 'Method'}
              </StyledText>
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
