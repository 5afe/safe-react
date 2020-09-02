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
import { TokenLogo } from 'src/components/TokenLogo'
import { useToken } from 'src/logic/tokens/hooks/useToken'
import { TokenSelectFieldItem } from '../TokenSelectFieldItem'
import { Token } from 'src/logic/tokens/store/model/token'

const SelectedToken = ({ classes, tokenAddress, tokens }) => {
  const token = tokens.find(({ address }) => address === tokenAddress)
  const tokenData = useToken(token.address) as Token | null

  return (
    <MenuItem className={classes.container}>
      {token ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <TokenLogo height={28} tokenName={tokenData?.name} tokenLogoUri={tokenData?.logoUri} />
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
      <TokenSelectFieldItem token={token} key={token.address} />
    ))}
  </Field>
)

export default withStyles(selectStyles)(TokenSelectField)
