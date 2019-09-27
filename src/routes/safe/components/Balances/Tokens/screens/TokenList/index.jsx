// @flow
import * as React from 'react'
import { List, Set } from 'immutable'
import cn from 'classnames'
import SearchBar from 'material-ui-search-bar'
import { withStyles } from '@material-ui/core/styles'
import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Search from '@material-ui/icons/Search'
import Img from '~/components/layout/Img'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Divider from '~/components/layout/Divider'
import Hairline from '~/components/layout/Hairline'
import Spacer from '~/components/Spacer'
import Row from '~/components/layout/Row'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { type Token } from '~/logic/tokens/store/model/token'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { styles } from './style'

export const ADD_CUSTOM_TOKEN_BUTTON_TEST_ID = 'add-custom-token-btn'
export const TOGGLE_TOKEN_TEST_ID = 'toggle-token-btn'

type Props = {
  classes: Object,
  tokens: List<Token>,
  safeAddress: string,
  activeTokens: List<Token>,
  fetchTokens: Function,
  updateActiveTokens: Function,
  setActiveScreen: Function,
}

type State = {
  filter: string,
  activeTokensAddresses: Set<string>,
}

const filterBy = (filter: string, tokens: List<Token>): List<Token> => tokens.filter(
  (token: Token) => !filter
      || token.symbol.toLowerCase().includes(filter.toLowerCase())
      || token.name.toLowerCase().includes(filter.toLowerCase()),
)

// OPTIMIZATION IDEA (Thanks Andre)
// Calculate active tokens on component mount, store it in component state
// After user closes modal, dispatch an action so we dont have 100500 actions
// And selectors dont recalculate

class Tokens extends React.Component<Props, State> {
  state = {
    filter: '',
    activeTokensAddresses: Set([]),
    activeTokensCalculated: false,
  }

  componentDidMount() {
    const { fetchTokens } = this.props

    fetchTokens()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // I moved this logic here because if placed in ComponentDidMount
    // the user would see Switches switch and this method fires before the component mounts

    if (!prevState.activeTokensCalculated) {
      const { activeTokens } = nextProps

      return {
        activeTokensAddresses: Set(activeTokens.map(({ address }) => address)),
        activeTokensCalculated: true,
      }
    }
    return null
  }

  componentWillUnmount() {
    const { activeTokensAddresses } = this.state
    const { updateActiveTokens, safeAddress } = this.props

    updateActiveTokens(safeAddress, activeTokensAddresses.toList())
  }

  onCancelSearch = () => {
    this.setState(() => ({ filter: '' }))
  }

  onChangeSearchBar = (value) => {
    this.setState(() => ({ filter: value }))
  }

  onSwitch = (token: Token) => () => {
    const { activeTokensAddresses } = this.state

    if (activeTokensAddresses.has(token.address)) {
      this.setState({
        activeTokensAddresses: activeTokensAddresses.remove(token.address),
      })
    } else {
      this.setState({
        activeTokensAddresses: activeTokensAddresses.add(token.address),
      })
    }
  }

  render() {
    const { classes, tokens, setActiveScreen } = this.props
    const { filter, activeTokensAddresses } = this.state
    const searchClasses = {
      input: classes.searchInput,
      root: classes.searchRoot,
      iconButton: classes.searchIcon,
      searchContainer: classes.searchContainer,
    }
    const switchToAddCustomTokenScreen = () => setActiveScreen('addCustomToken')

    const filteredTokens = filterBy(filter, tokens)

    return (
      <>
        <Block className={classes.root}>
          <Row align="center" className={cn(classes.padding, classes.actions)}>
            <Search className={classes.search} />
            <SearchBar
              placeholder="Search by name or symbol"
              classes={searchClasses}
              searchIcon={<div />}
              onChange={this.onChangeSearchBar}
              onCancelSearch={this.onCancelSearch}
            />
            <Spacer />
            <Divider />
            <Spacer />
            <Button
              variant="contained"
              size="small"
              color="primary"
              className={classes.add}
              onClick={switchToAddCustomTokenScreen}
              testId={ADD_CUSTOM_TOKEN_BUTTON_TEST_ID}
            >
              + Add custom token
            </Button>
          </Row>
          <Hairline />
        </Block>
        <MuiList className={classes.list}>
          {!tokens.size && (
            <Block align="center" className={classes.progressContainer}>
              <CircularProgress />
            </Block>
          )}
          {filteredTokens.map((token: Token) => {
            const isActive = activeTokensAddresses.has(token.address)

            return (
              <ListItem key={token.address} className={classes.token}>
                <ListItemIcon className={classes.tokenIcon}>
                  <Img src={token.logoUri} height={28} alt={token.name} onError={setImageToPlaceholder} />
                </ListItemIcon>
                <ListItemText primary={token.symbol} secondary={token.name} />
                {token.address !== ETH_ADDRESS && (
                  <ListItemSecondaryAction>
                    <Switch
                      onChange={this.onSwitch(token)}
                      checked={isActive}
                      inputProps={{ 'data-testid': `${token.symbol}_${TOGGLE_TOKEN_TEST_ID}` }}
                    />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            )
          })}
        </MuiList>
      </>
    )
  }
}

const TokenComponent = withStyles(styles)(Tokens)

export default TokenComponent
