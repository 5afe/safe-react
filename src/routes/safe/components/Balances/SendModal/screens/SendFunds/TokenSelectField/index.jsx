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
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { selectedTokenStyles, selectStyles } from './style'

type SelectFieldProps = {
  classes: Object,
  initialValue: string,
  isValid: boolean,
  tokens: List<Token>,
}

type SelectedTokenProps = {
  classes: Object,
  tokenAddress?: string,
  tokens: List<Token>,
}

const SelectedToken = ({ classes, tokenAddress, tokens }: SelectedTokenProps) => {
  const token = tokens.find(({ address }) => address === tokenAddress)

  return (
    <MenuItem className={classes.container}>
      {token ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <Img alt={token.name} height={28} onError={setImageToPlaceholder} src={token.logoUri} />
          </ListItemIcon>
          <ListItemText
            className={classes.tokenData}
            primary={token.name}
            secondary={`${formatAmount(token.balance)} ${token.symbol}`}
          />
        </>
      ) : (
        <Paragraph color="disabled" size="md" style={{ opacity: 0.5 }} weight="light">
          Select an asset*
        </Paragraph>
      )}
    </MenuItem>
  )
}
const SelectedTokenStyled = withStyles(selectedTokenStyles)(SelectedToken)

const TokenSelectField = ({ classes, initialValue, isValid, tokens }: SelectFieldProps) => (
  <Field
    className={isValid ? 'isValid' : 'isInvalid'}
    classes={{ selectMenu: classes.selectMenu }}
    component={SelectField}
    displayEmpty
    initialValue={initialValue}
    name="token"
    renderValue={tokenAddress => <SelectedTokenStyled tokenAddress={tokenAddress} tokens={tokens} />}
    validate={required}
  >
    {tokens.map(token => (
      <MenuItem key={token.address} value={token.address}>
        <ListItemIcon>
          <Img alt={token.name} height={28} onError={setImageToPlaceholder} src={token.logoUri} />
        </ListItemIcon>
        <ListItemText primary={token.name} secondary={`${formatAmount(token.balance)} ${token.symbol}`} />
      </MenuItem>
    ))}
  </Field>
)

export default withStyles(selectStyles)(TokenSelectField)
