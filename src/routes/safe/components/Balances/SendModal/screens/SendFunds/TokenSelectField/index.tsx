import { Text } from '@gnosis.pm/safe-react-components'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { List } from 'immutable'
import { ReactElement } from 'react'

import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import { required } from 'src/components/forms/validator'
import Img from 'src/components/layout/Img'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { Token } from 'src/logic/tokens/store/model/token'

import { useSelectStyles, useSelectedTokenStyles } from './style'

interface SelectTokenProps {
  tokenAddress: string
  tokens: List<Token>
}

const SelectedToken = ({ tokenAddress, tokens }: SelectTokenProps): ReactElement => {
  const classes = useSelectedTokenStyles()
  const token = tokens.find(({ address }) => address === tokenAddress)

  return (
    <MenuItem className={classes.container} disableRipple>
      {token ? (
        <>
          <ListItemIcon>
            <Img
              className={classes.tokenImage}
              alt={token.name}
              onError={setImageToPlaceholder}
              src={token.logoUri || ''}
            />
          </ListItemIcon>
          <ListItemText
            className={classes.tokenData}
            primary={token.name}
            secondary={`${formatAmount(token.balance?.tokenBalance.toString() ?? '0')} ${token.symbol}`}
          />
        </>
      ) : (
        <Text color="placeHolder" size="xl">
          Select an asset*
        </Text>
      )}
    </MenuItem>
  )
}

interface TokenSelectFieldProps {
  initialValue?: string
  isValid?: boolean
  tokens: List<Token>
}

const TokenSelectField = ({ initialValue, isValid = true, tokens }: TokenSelectFieldProps): ReactElement => {
  const classes = useSelectStyles()
  const tokenClasses = useSelectedTokenStyles()

  return (
    <Field
      classes={{ selectMenu: classes.selectMenu }}
      className={isValid ? 'isValid' : 'isInvalid'}
      component={(props) => (
        <SelectField
          {...props}
          inputProps={{
            'data-testid': 'token-input',
          }}
        />
      )}
      displayEmpty
      initialValue={initialValue}
      name="token"
      renderValue={(tokenAddress) => <SelectedToken tokenAddress={tokenAddress} tokens={tokens} />}
      validate={required}
    >
      {tokens.map((token) => (
        <MenuItem key={token.address} value={token.address}>
          <ListItemIcon>
            <Img
              className={tokenClasses.tokenImage}
              alt={token.name}
              onError={setImageToPlaceholder}
              src={token.logoUri || ''}
            />
          </ListItemIcon>
          <ListItemText
            primary={token.name}
            secondary={`${formatAmount(token.balance?.tokenBalance.toString() ?? '0')} ${token.symbol}`}
            data-testid={`select-token-${token.name}`}
          />
        </MenuItem>
      ))}
    </Field>
  )
}

export default TokenSelectField
