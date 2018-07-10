// @flow
import * as React from 'react'
import { type Token } from '~/routes/tokens/store/model/token'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Checkbox from '@material-ui/core/Checkbox'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
// import Delete from '@material-ui/icons/Delete'
// import IconButton from '@material-ui/core/IconButton'
import { type WithStyles } from '~/theme/mui'

type Props = WithStyles & {
  token: Token,
  onRemoveToken: (balance: Token)=> void,
  onEnableToken: (token: Token) => void,
  onDisableToken: (token: Token) => void,
}

type State = {
  checked: boolean,
}

const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 45,
    height: 45,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
})

class TokenComponent extends React.Component<Props, State> {
  state = {
    checked: true,
  }

  // onRemoveClick = () => this.props.onRemoveToken(this.props.token)

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { checked } = e.target
    const callback = checked ? this.props.onDisableToken : this.props.onDisableToken
    this.setState(() => ({ checked: e.target.checked }), () => callback(this.props.token))
  }

  render() {
    const { classes, token } = this.props
    const name = token.get('name')
    const symbol = token.get('symbol')

    return (
      <Card className={classes.card}>
        <Block className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="headline">{name}</Typography>
            <Typography variant="subheading" color="textSecondary">
              {symbol}
            </Typography>
          </CardContent>
          <Block className={classes.controls}>
            <Bold>
              {symbol}
            </Bold>
            <Checkbox
              checked={this.state.checked}
              onChange={this.handleChange}
              color="primary"
            />
            {/*
            <IconButton aria-label="Delete" onClick={this.onRemoveClick}>
              <Delete />
            </IconButton>
            */}
          </Block>
        </Block>
        <CardMedia
          className={classes.cover}
          image={token.get('logoUrl')}
          title={name}
        />
      </Card>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TokenComponent)
