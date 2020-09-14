import CircularProgress from '@material-ui/core/CircularProgress'
import MuiList from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import Search from '@material-ui/icons/Search'
import cn from 'classnames'
import { List, Set } from 'immutable'
import SearchBar from 'material-ui-search-bar'
import * as React from 'react'
import { FixedSizeList } from 'react-window'

import TokenRow from './TokenRow'
import { styles } from './style'

import Spacer from 'src/components/Spacer'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Divider from 'src/components/layout/Divider'
import Hairline from 'src/components/layout/Hairline'
import Row from 'src/components/layout/Row'
import { useEffect, useState } from 'react'
import { Token } from 'src/logic/tokens/store/model/token'
import { useDispatch } from 'react-redux'
import updateBlacklistedTokens from 'src/logic/safe/store/actions/updateBlacklistedTokens'
import updateActiveTokens from 'src/logic/safe/store/actions/updateActiveTokens'

export const ADD_CUSTOM_TOKEN_BUTTON_TEST_ID = 'add-custom-token-btn'

const filterBy = (filter: string, tokens: List<Token>): List<Token> =>
  tokens.filter(
    (token) =>
      !filter ||
      token.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      token.name.toLowerCase().includes(filter.toLowerCase()),
  )

const useStyles = makeStyles(styles)

type Props = {
  setActiveScreen: (newScreen: string) => void
  tokens: List<Token>
  activeTokens: List<Token>
  blacklistedTokens: Set<string>
  safeAddress: string
}

export const TokenList = (props: Props): React.ReactElement => {
  const classes = useStyles()
  const { setActiveScreen, tokens, activeTokens, blacklistedTokens, safeAddress } = props
  const [activeTokensAddresses, setActiveTokensAddresses] = useState(Set(activeTokens.map(({ address }) => address)))
  const [blacklistedTokensAddresses, setBlacklistedTokensAddresses] = useState<Set<string>>(blacklistedTokens)
  const [filter, setFilter] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(updateActiveTokens(safeAddress, activeTokensAddresses))
      dispatch(updateBlacklistedTokens(safeAddress, blacklistedTokensAddresses))
    }
  }, [dispatch, safeAddress, activeTokensAddresses, blacklistedTokensAddresses])

  const searchClasses = {
    input: classes.searchInput,
    root: classes.searchRoot,
    iconButton: classes.searchIcon,
    searchContainer: classes.searchContainer,
  }

  const onCancelSearch = () => {
    setFilter('')
    this.setState(() => ({ filter: '' }))
  }

  const onChangeSearchBar = (value: string) => {
    setFilter(value)
  }

  const onSwitch = (token: Token) => () => {
    if (activeTokensAddresses.has(token.address)) {
      const newTokens = activeTokensAddresses.remove(token.address)
      setActiveTokensAddresses(newTokens)
      setBlacklistedTokensAddresses(blacklistedTokensAddresses.add(token.address))
    } else {
      setActiveTokensAddresses(activeTokensAddresses.add(token.address))
      setBlacklistedTokensAddresses(blacklistedTokensAddresses.remove(token.address))
    }
  }

  const createItemData = (
    tokens: List<Token>,
    activeTokensAddresses: Set<string>,
  ): { tokens: List<Token>; activeTokensAddresses: Set<string>; onSwitch: (token: Token) => void } => {
    return {
      tokens,
      activeTokensAddresses,
      onSwitch: onSwitch,
    }
  }

  const switchToAddCustomTokenScreen = () => setActiveScreen('addCustomToken')

  const getItemKey = (index: number, { tokens }): string => {
    return tokens.get(index).address
  }

  const filteredTokens = filterBy(filter, tokens)
  const itemData = createItemData(filteredTokens, activeTokensAddresses)

  return (
    <>
      <Block className={classes.root}>
        <Row align="center" className={cn(classes.padding, classes.actions)}>
          <Search className={classes.search} />
          <SearchBar
            classes={searchClasses}
            onCancelSearch={onCancelSearch}
            onChange={onChangeSearchBar}
            placeholder="Search by name or symbol"
            searchIcon={<div />}
            value={filter}
          />
          <Spacer />
          <Divider />
          <Spacer />
          <Button
            classes={{ label: classes.addBtnLabel }}
            className={classes.add}
            color="primary"
            onClick={switchToAddCustomTokenScreen}
            size="small"
            testId={ADD_CUSTOM_TOKEN_BUTTON_TEST_ID}
            variant="contained"
          >
            + Add custom token
          </Button>
        </Row>
        <Hairline />
      </Block>
      {!tokens.size && (
        <Block className={classes.progressContainer} justify="center">
          <CircularProgress />
        </Block>
      )}
      {tokens.size > 0 && (
        <MuiList className={classes.list}>
          <FixedSizeList
            height={413}
            itemCount={filteredTokens.size}
            itemData={itemData}
            itemKey={getItemKey}
            itemSize={51}
            overscanCount={process.env.NODE_ENV === 'test' ? 100 : 10}
            width={500}
          >
            {TokenRow}
          </FixedSizeList>
        </MuiList>
      )}
    </>
  )
}
