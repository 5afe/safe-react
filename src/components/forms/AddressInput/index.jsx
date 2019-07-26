// @flow
import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'
import TextField from '~/components/forms/TextField'
import { composeValidators, required, mustBeEthereumAddress } from '~/components/forms/validator'
import { getAddressFromENS } from '~/logic/wallets/getWeb3'

type Props = {
  className?: string,
  name?: string,
  text?: string,
  placeholder?: string,
}

const isValidEnsName = name => /^([\w-]+\.)+(eth|test)$/.test(name)

const AddressInput = ({
  className = '',
  name = 'recipientAddress',
  text = 'Recipient*',
  placeholder = 'Recipient*',
}: Props): React.Element<*> => (
  <>
    <Field
      name={name}
      component={TextField}
      type="text"
      // validate={composeValidators(required, mustBeEthereumAddress)}
      placeholder={placeholder}
      text={text}
      className={className}
    />
    <OnChange name={name}>
      {async (value) => {
        if (isValidEnsName(value)) {
          try {
            const resolverAddr = await getAddressFromENS(value)
          } catch {
            console.error('No resolver for ENS name')
          }
        }
      }}
    </OnChange>
  </>
)

export default AddressInput
