import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { selectStyles, selectedTokenStyles } from './style'
import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import { required } from 'src/components/forms/validator'

import Paragraph from 'src/components/layout/Paragraph'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { TokenSymbol } from 'src/components/TokenSymbol'
const SelectedToken = ({ classes, tokenAddress, tokens }) => {
  const token = tokens.find(({ address }) => address === tokenAddress)

  return (
    <MenuItem className={classes.container}>
      {token ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <TokenSymbol tokenAddress={token.address} />
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

const TokenSelectField = ({ classes, initialValue, isValid, tokens }) => (
  <Field
    classes={{ selectMenu: classes.selectMenu }}
    className={isValid ? 'isValid' : 'isInvalid'}
    component={SelectField}
    displayEmpty
    initialValue={initialValue}
    name="token"
    renderValue={(tokenAddress) => <SelectedTokenStyled tokenAddress={tokenAddress} tokens={tokens} />}
    validate={required}
  >
    {tokens.map((token) => (
      <MenuItem key={token.address} value={token.address}>
        <ListItemIcon>
          <TokenSymbol tokenAddress={token.address} />
        </ListItemIcon>
        <ListItemText
          primary={token.name}
          secondary={`${formatAmount(token.balance)} ${token.symbol}`}
          data-testid={`select-token-${token.name}`}
        />
      </MenuItem>
    ))}
  </Field>
)

export default withStyles(selectStyles)(TokenSelectField)
