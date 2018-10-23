// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import SearchBar from 'material-ui-search-bar'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import Search from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Divider from '~/components/layout/Divider'
import Hairline from '~/components/layout/Hairline'
import Spacer from '~/components/Spacer'
import Row from '~/components/layout/Row'
import { lg, md, sm, xs, mediumFontSize } from '~/theme/variables'

const styles = () => ({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
  },
  manage: {
    fontSize: '24px',
  },
  actions: {
    height: '50px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
  search: {
    color: '#a2a8ba',
    paddingLeft: sm,
  },
  padding: {
    padding: `0 ${md}`,
  },
  add: {
    fontWeight: 'normal',
    paddingRight: md,
    paddingLeft: md,
  },
  searchInput: {
    backgroundColor: 'transparent',
    lineHeight: 'initial',
    fontSize: mediumFontSize,
    padding: 0,
    '& > input::placeholder': {
      letterSpacing: '-0.5px',
      fontSize: mediumFontSize,
      color: 'black',
    },
    '& > input': {
      letterSpacing: '-0.5px',
    },
  },
  searchContainer: {
    width: '180px',
    marginLeft: xs,
    marginRight: xs,
  },
  searchRoot: {
    letterSpacing: '-0.5px',
    fontFamily: 'Roboto Mono, monospace',
    fontSize: mediumFontSize,
    border: 'none',
    boxShadow: 'none',
  },
  searchIcon: {
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
}

class Tokens extends React.Component<Props> {
  requestSearch = () => {
    // eslint-disable-next-line
    console.log("Filtering by name or symbol...")
  }

  render() {
    const { onClose, classes } = this.props
    const searchClasses = {
      input: classes.searchInput,
      root: classes.searchRoot,
      iconButton: classes.searchIcon,
      searchContainer: classes.searchContainer,
    }

    return (
      <React.Fragment>
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
            onRequestSearch={this.requestSearch}
            searchIcon={<div />}
          />
          <Spacer />
          <Divider />
          <Spacer />
          <Button variant="contained" size="small" color="secondary" className={classes.add}>
            + ADD CUSTOM TOKEN
          </Button>
        </Row>
        <Hairline />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Tokens)
