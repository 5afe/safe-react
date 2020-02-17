// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Field from '~/components/forms/Field'
import AddressInput from '~/components/forms/AddressInput'
import { composeValidators, required, noErrorsOn, mustBeEthereumAddress } from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS } from '~/routes/load/components/fields'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getSafeMasterContract, SAFE_MASTER_COPY_ADDRESS_V10, validateProxy } from '~/logic/contracts/safeContracts'
import { secondary } from '~/theme/variables'

type Props = {
  classes: Object,
  errors: Object,
  form: Object,
}

const styles = () => ({
  root: {
    display: 'flex',
    maxWidth: '460px',
    marginTop: '12px',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
  links: {
    '&>a': {
      color: secondary,
    },
  },
})

export const SAFE_INSTANCE_ERROR = 'Address given is not a Safe instance'
export const SAFE_MASTERCOPY_ERROR = 'Mastercopy used by this Safe is not the same'

// In case of an error here, it will be swallowed by final-form
// So if you're experiencing any strang behaviours like freeze or hanging
// Don't mind to check if everything is OK inside this function :)
export const safeFieldsValidation = async (values: Object) => {
  const errors = {}
  const web3 = getWeb3()
  const safeAddress = values[FIELD_LOAD_ADDRESS]

  if (!safeAddress || mustBeEthereumAddress(safeAddress) !== undefined) {
    return errors
  }

  const isValidProxy = await validateProxy(safeAddress)
  if (!isValidProxy) {
    errors[FIELD_LOAD_ADDRESS] = SAFE_INSTANCE_ERROR
    return errors
  }

  // check mastercopy
  const proxyAddressFromStorage = await web3.eth.getStorageAt(safeAddress, 0)
  // https://www.reddit.com/r/ethereum/comments/6l3da1/how_long_are_ethereum_addresses/
  // ganache returns plain address
  // rinkeby returns 0x0000000000000+{40 address charachers}
  // address comes last so we just get last 40 charachers (1byte = 2hex chars)
  const checksummedProxyAddress = web3.utils.toChecksumAddress(
    `0x${proxyAddressFromStorage.substr(proxyAddressFromStorage.length - 40)}`,
  )
  const safeMaster = await getSafeMasterContract()
  const masterCopy = safeMaster.address
  const sameMasterCopy =
    checksummedProxyAddress === masterCopy || checksummedProxyAddress === SAFE_MASTER_COPY_ADDRESS_V10
  if (!sameMasterCopy) {
    errors[FIELD_LOAD_ADDRESS] = SAFE_MASTERCOPY_ERROR
  }

  return errors
}

const Details = ({ classes, errors, form }: Props) => (
  <>
    <Block margin="md">
      <Paragraph noMargin size="md" color="primary">
        You are about to load an existing Gnosis Safe. First, choose a name and enter the Safe address. The name is only
        stored locally and will never be shared with Gnosis or any third parties.
        <br />
        Your connected wallet does not have to be the owner of this Safe. In this case, the interface will provide you a
        read-only view.
      </Paragraph>
    </Block>
    <Block className={classes.root}>
      <Field
        name={FIELD_LOAD_NAME}
        component={TextField}
        type="text"
        validate={required}
        placeholder="Name of the Safe"
        text="Safe name"
      />
    </Block>
    <Block margin="lg" className={classes.root}>
      <AddressInput
        name={FIELD_LOAD_ADDRESS}
        component={TextField}
        fieldMutator={val => {
          form.mutators.setValue(FIELD_LOAD_ADDRESS, val)
        }}
        inputAdornment={
          noErrorsOn(FIELD_LOAD_ADDRESS, errors) && {
            endAdornment: (
              <InputAdornment position="end">
                <CheckCircle className={classes.check} />
              </InputAdornment>
            ),
          }
        }
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress)}
        placeholder="Safe Address*"
        text="Safe Address"
      />
    </Block>
    <Block margin="sm">
      <Paragraph noMargin size="md" color="primary" className={classes.links}>
        By continuing you consent with the{' '}
        <a rel="noopener noreferrer" href="https://safe.gnosis.io/terms" target="_blank">
          terms of use
        </a>{' '}
        and{' '}
        <a rel="noopener noreferrer" href="https://safe.gnosis.io/privacy" target="_blank">
          privacy policy
        </a>
        . Most importantly, you confirm that your funds are held securely in the Gnosis Safe, a smart contract on the
        Ethereum blockchain. These funds cannot be accessed by Gnosis at any point.
      </Paragraph>
    </Block>
  </>
)

const DetailsForm = withStyles(styles)(Details)

const DetailsPage = () => (controls: React.Node, { errors, form }: Object) => (
  <>
    <OpenPaper controls={controls}>
      <DetailsForm errors={errors} form={form} />
    </OpenPaper>
  </>
)

export default DetailsPage
