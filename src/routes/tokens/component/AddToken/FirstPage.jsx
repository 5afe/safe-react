// @flow
import * as React from 'react'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, required, mustBeEthereumAddress, uniqueAddress } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import { promisify } from '~/utils/promisify'
import { getWeb3 } from '~/wallets/getWeb3'
import { EMPTY_DATA } from '~/wallets/ethTransactions'
import { getStandardTokenContract } from '~/routes/tokens/store/actions/fetchTokens'

type Props = {
  addresses: string[],
}

export const TOKEN_ADRESS_PARAM = 'tokenAddress'

export const token = async (tokenAddress: string) => {
  const code = await promisify(cb => getWeb3().eth.getCode(tokenAddress, cb))
  const isDeployed = code !== EMPTY_DATA

  if (!isDeployed) {
    return 'Specified address is not deployed on the current network'
  }

  const erc20Token = await getStandardTokenContract()
  const instance = await erc20Token.at(tokenAddress)
  const supply = await instance.totalSupply()

  if (Number(supply) === 0) {
    return 'Specified address is not a valid standard token'
  }

  return undefined
}

const FirstPage = ({ addresses }: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      Add Custom ERC20 Token
    </Heading>
    <Block margin="md">
      <Field
        name={TOKEN_ADRESS_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress, uniqueAddress(addresses), token)}
        placeholder="ERC20 Token Address*"
        text="ERC20 Token Address"
      />
    </Block>
  </Block>
)

export default FirstPage
