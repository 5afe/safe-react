// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
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
import { type Token } from '~/routes/tokens/store/model/token'
import actions, { type Actions } from './actions'
import { styles } from './style'

type Props = Actions & {
  onClose: () => void,
  classes: Object,
  tokens: List<Token>,
  safeAddress: string,
}

type State = {
  filter: string,
}

const filterBy = (filter: string, tokens: List<Token>): List<Token> => tokens.filter((token: Token) => !filter
    || token.get('symbol').toLowerCase().includes(filter.toLowerCase())
    || token.get('name').toLowerCase().includes(filter.toLowerCase()))


class Tokens extends React.Component<Props, State> {
  state = {
    filter: '',
  }

  onCancelSearch = () => {
    this.setState(() => ({ filter: '' }))
  }

  onChangeSearchBar = (value) => {
    this.setState(() => ({ filter: value }))
  }

  onSwitch = (token: Token) => (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { checked } = e.target
    const { safeAddress, enableToken, disableToken } = this.props

    if (checked) {
      enableToken(safeAddress, token)

      return
    }

    disableToken(safeAddress, token)
  }

  render() {
    const { onClose, classes, tokens } = this.props
    const { filter } = this.state
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
            <Paragraph className={classes.manage} noMargin>Manage Tokens</Paragraph>
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
          {filteredTokens.map((token: Token) => (
            <ListItem key={token.get('address')} className={classes.token}>
              <ListItemIcon>
                <Img src={token.get('logoUri')} height={28} alt={token.get('name')} />
              </ListItemIcon>
              <ListItemText primary={token.get('symbol')} secondary={token.get('name')} />
              <ListItemSecondaryAction>
                <Switch
                  onChange={this.onSwitch(token)}
                  checked={token.get('status')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </MuiList>
      </React.Fragment>
    )
  }
}

const TokenComponent = withStyles(styles)(Tokens)

export default connect(undefined, actions)(TokenComponent)
