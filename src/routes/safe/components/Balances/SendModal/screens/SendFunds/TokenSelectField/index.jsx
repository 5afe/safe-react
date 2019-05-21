// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Field from '~/components/forms/Field'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import SelectField from '~/components/forms/SelectField'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'
import { required } from '~/components/forms/validator'
import { type Token } from '~/logic/tokens/store/model/token'
import { selectedTokenStyles, selectStyles } from './style'

type SelectFieldProps = {
  tokens: List<Token>,
  classes: Object,
}

type SelectedTokenProps = {
  token?: Token,
  classes: Object,
}

const SelectedToken = ({ token, classes }: SelectedTokenProps) => (
  <MenuItem className={classes.container}>
    {token ? (
      <>
        <ListItemIcon className={classes.tokenImage}>
          <Img src={token.logoUri} height={28} alt={token.name} onError={setImageToPlaceholder} />
        </ListItemIcon>
        <ListItemText
          className={classes.tokenData}
          primary={token.name}
          secondary={`${token.balance} ${token.symbol}`}
        />
      </>
    ) : (
      <Paragraph color="disabled" size="lg" weight="light" style={{ opacity: 0.5 }}>
        Select an asset*
      </Paragraph>
    )}
  </MenuItem>
)

const SelectedTokenStyled = withStyles(selectedTokenStyles)(SelectedToken)

const TokenSelectField = ({ tokens, classes }: SelectFieldProps) => (
  <Field
    name="token"
    component={SelectField}
    classes={{ selectMenu: classes.selectMenu }}
    validate={required}
    renderValue={token => <SelectedTokenStyled token={token} />}
    initialValue=""
    displayEmpty
  >
    {tokens.map(token => (
      <MenuItem key={token.address} value={token}>
        <ListItemIcon>
          <Img src={token.logoUri} height={28} alt={token.name} onError={setImageToPlaceholder} />
        </ListItemIcon>
        <ListItemText primary={token.name} secondary={`${token.balance} ${token.symbol}`} />
      </MenuItem>
    ))}
  </Field>
)

export default withStyles(selectStyles)(TokenSelectField)
