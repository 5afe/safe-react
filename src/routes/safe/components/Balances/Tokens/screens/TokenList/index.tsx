import CircularProgress from '@material-ui/core/CircularProgress'
import MuiList from '@material-ui/core/List'
import { withStyles } from '@material-ui/core/styles'
import Search from '@material-ui/icons/Search'
import cn from 'classnames'
import { Set } from 'immutable'
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

export const ADD_CUSTOM_TOKEN_BUTTON_TEST_ID = 'add-custom-token-btn'

const filterBy = (filter, tokens) =>
  tokens.filter(
    (token) =>
      !filter ||
      token.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      token.name.toLowerCase().includes(filter.toLowerCase()),
  )

// OPTIMIZATION IDEA (Thanks Andre)
// Calculate active tokens on component mount, store it in component state
// After user closes modal, dispatch an action so we don't have 100500 actions
// And selectors don't recalculate

class Tokens extends React.Component<any> {
  renderCount = 0

  state = {
    filter: '',
    activeTokensAddresses: Set([]),
    initialActiveTokensAddresses: Set([]),
    blacklistedTokensAddresses: Set([]),
    activeTokensCalculated: false,
    blacklistedTokensCalculated: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // I moved this logic here because if placed in ComponentDidMount
    // the user would see Switches switch and this method fires before the component mounts

    if (!prevState.activeTokensCalculated) {
      const { activeTokens } = nextProps

      return {
        activeTokensAddresses: Set(activeTokens.map(({ address }) => address)),
        initialActiveTokensAddresses: Set(activeTokens.map(({ address }) => address)),
        activeTokensCalculated: true,
      }
    }

    if (!prevState.blacklistedTokensCalculated) {
      const { blacklistedTokens } = nextProps

      return {
        blacklistedTokensAddresses: blacklistedTokens,
        blacklistedTokensCalculated: true,
      }
    }

    return null
  }

  componentWillUnmount() {
    const { activeTokensAddresses, blacklistedTokensAddresses } = this.state
    const { safeAddress, updateActiveTokens, updateBlacklistedTokens } = this.props

    updateActiveTokens(safeAddress, activeTokensAddresses)
    updateBlacklistedTokens(safeAddress, blacklistedTokensAddresses)
  }

  onCancelSearch = () => {
    this.setState(() => ({ filter: '' }))
  }

  onChangeSearchBar = (value) => {
    this.setState(() => ({ filter: value }))
  }

  onSwitch = (token) => () => {
    this.setState((prevState: any) => {
      const activeTokensAddresses = prevState.activeTokensAddresses.has(token.address)
        ? prevState.activeTokensAddresses.remove(token.address)
        : prevState.activeTokensAddresses.add(token.address)

      let { blacklistedTokensAddresses } = prevState
      if (activeTokensAddresses.has(token.address)) {
        blacklistedTokensAddresses = prevState.blacklistedTokensAddresses.remove(token.address)
      } else if (prevState.initialActiveTokensAddresses.has(token.address)) {
        blacklistedTokensAddresses = prevState.blacklistedTokensAddresses.add(token.address)
      }

      return { ...prevState, activeTokensAddresses, blacklistedTokensAddresses }
    })
  }

  createItemData = (tokens, activeTokensAddresses) => ({
    tokens,
    activeTokensAddresses,
    onSwitch: this.onSwitch,
  })

  getItemKey = (index, { tokens }) => {
    const token = tokens.get(index)

    return token.address
  }

  render() {
    const { classes, setActiveScreen, tokens } = this.props
    const { activeTokensAddresses, filter } = this.state
    const searchClasses = {
      input: classes.searchInput,
      root: classes.searchRoot,
      iconButton: classes.searchIcon,
      searchContainer: classes.searchContainer,
    }
    const switchToAddCustomTokenScreen = () => setActiveScreen('addCustomToken')

    const filteredTokens = filterBy(filter, tokens)
    const itemData = this.createItemData(filteredTokens, activeTokensAddresses)

    return (
      <>
        <Block className={classes.root}>
          <Row align="center" className={cn(classes.padding, classes.actions)}>
            <Search className={classes.search} />
            <SearchBar
              classes={searchClasses}
              onCancelSearch={this.onCancelSearch}
              onChange={this.onChangeSearchBar}
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
              itemKey={this.getItemKey}
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
}

const TokenComponent = withStyles(styles as any)(Tokens)

export default TokenComponent
