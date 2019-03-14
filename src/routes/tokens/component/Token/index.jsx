// @flow
import * as React from 'react'
import { type Token } from '~/routes/tokens/store/model/token'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Checkbox from '@material-ui/core/Checkbox'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { isEther } from '~/utils/tokens'
import Delete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { type WithStyles } from '~/theme/mui'

type Props = WithStyles & {
  token: Token,
  onRemove: (token: Token)=> void,
  onEnableToken: (token: Token) => void,
  onDisableToken: (token: Token) => void,
}

type State = {
  checked: boolean,
}

const styles = () => ({
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
    width: 150,
    margin: 10,
    backgroundSize: '50%',
  },
})

class TokenComponent extends React.PureComponent<Props, State> {
  state = {
    checked: this.props.token.get('status'),
  }

  onRemoveClick = () => this.props.onRemove(this.props.token)

  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { checked } = e.target

    const callback = checked ? this.props.onEnableToken : this.props.onDisableToken
    this.setState(() => ({ checked }), () => callback(this.props.token))
  }

  render() {
    const { classes, token } = this.props
    const { checked } = this.state
    const name = token.get('name')
    const symbol = token.get('symbol')
    const disabled = isEther(symbol)

    return (
      <Card className={classes.card}>
        <Block className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="headline">{name}</Typography>
            <Typography variant="subheading" color="textSecondary">
              <Checkbox
                disabled={disabled}
                checked={!!checked}
                onChange={this.handleChange}
                color="primary"
              />
              {symbol}
              { token.get('removable')
                && (
                  <IconButton aria-label="Delete" onClick={this.onRemoveClick}>
                    <Delete />
                  </IconButton>
                )
              }
            </Typography>
          </CardContent>
        </Block>
        <CardMedia
          className={classes.cover}
          image={token.get('logoUri')}
          title={name}
        />
      </Card>
    )
  }
}

export default withStyles(styles, { withTheme: true })(TokenComponent)
