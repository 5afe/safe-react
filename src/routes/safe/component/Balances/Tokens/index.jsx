// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { List, Set } from 'immutable'
import classNames from 'classnames/bind'
import SearchBar from 'material-ui-search-bar'
import { withStyles } from '@material-ui/core/styles'
import MuiList from '@material-ui/core/List'
import Img from '~/components/layout/Img'
import Block from '~/components/layout/Block'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Close from '@material-ui/icons/Close'
import Search from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Switch from '@material-ui/core/Switch'
import Divider from '~/components/layout/Divider'
import Hairline from '~/components/layout/Hairline'
import Spacer from '~/components/Spacer'
import Row from '~/components/layout/Row'
import { ETH_ADDRESS } from '~/logic/tokens/utils/tokenHelpers'
import { type Token } from '~/logic/tokens/store/model/token'
import actions, { type Actions } from './actions'
import TokenPlaceholder from './assets/token_placeholder.svg'
import { styles } from './style'

type Props = Actions & {
  onClose: () => void,
  classes: Object,
  tokens: List<Token>,
  safeAddress: string,
  activeTokens: List<Token>,
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
    activeScreen: '',
    filter: '',
    activeTokensAddresses: Set([]),
    activeTokensCalculated: false,
  }

  componentDidMount() {
    const { fetchTokens, safeAddress } = this.props

    fetchTokens(safeAddress)
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

  setImageToPlaceholder = (e) => {
    e.target.onerror = null
    e.target.src = TokenPlaceholder
  }

  render() {
    const { onClose, classes, tokens } = this.props
    const { filter, activeTokensAddresses } = this.state
    const searchClasses = {
      input: classes.searchInput,
      root: classes.searchRoot,
      iconButton: classes.searchIcon,
      searchContainer: classes.searchContainer,
    }

    const filteredTokens = filterBy(filter, tokens)

    return (
      <React.Fragment>
        <Block className={classes.root}>
          <Row align="center" grow className={classes.heading}>
            <Paragraph className={classes.manage} noMargin>
              Manage Tokens
            </Paragraph>
            <IconButton onClick={onClose} disableRipple>
              <Close className={classes.close} />
            </IconButton>
          </Row>
          <Hairline />
          <Row align="center" className={classNames(classes.padding, classes.actions)}>
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
            <Button variant="contained" size="small" color="secondary" className={classes.add}>
              + ADD CUSTOM TOKEN
            </Button>
          </Row>
          <Hairline />
        </Block>
        <MuiList className={classes.list}>
          {filteredTokens.map((token: Token) => {
            const isActive = activeTokensAddresses.has(token.address)

            return (
              <ListItem key={token.address} className={classes.token}>
                <ListItemIcon>
                  <Img src={token.logoUri} height={28} alt={token.name} onError={this.setImageToPlaceholder} />
                </ListItemIcon>
                <ListItemText primary={token.symbol} secondary={token.name} />
                {token.address !== ETH_ADDRESS && (
                  <ListItemSecondaryAction>
                    <Switch onChange={this.onSwitch(token)} checked={isActive} />
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            )
          })}
        </MuiList>
      </React.Fragment>
    )
  }
}

const TokenComponent = withStyles(styles)(Tokens)

export default connect(
  undefined,
  actions,
)(TokenComponent)
