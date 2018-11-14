// @flow
import * as React from 'react'
import contract from 'truffle-contract'
import { withStyles } from '@material-ui/core/styles'
import Field from '~/components/forms/Field'
import { composeValidators, required, noErrorsOn, mustBeEthereumAddress } from '~/components/forms/validator'
import TextField from '~/components/forms/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import OpenPaper from '~/components/Stepper/OpenPaper'
import { FIELD_LOAD_NAME, FIELD_LOAD_ADDRESS } from '~/routes/load/components/fields'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import SafeProxy from '#/Proxy.json'
import { getSafeMasterContract } from '~/logic/contracts/safeContracts'

type Props = {
  classes: Object,
  errors: Object,
}

const styles = () => ({
  root: {
    display: 'flex',
    maxWidth: '460px',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
})

export const SAFE_INSTANCE_ERROR = 'Address given is not a safe instance'
export const SAFE_MASTERCOPY_ERROR = 'Mastercopy used by this safe is not the same'

export const safeFieldsValidation = async (values: Object) => {
  const errors = {}

  const web3 = getWeb3()
  const safeAddress = values[FIELD_LOAD_ADDRESS]
  if (!safeAddress || mustBeEthereumAddress(safeAddress) !== undefined) {
    return errors
  }

  // https://solidity.readthedocs.io/en/latest/metadata.html#usage-for-source-code-verification
  const metaData = 'a165'

  const code = await promisify(cb => web3.eth.getCode(safeAddress, cb))
  const codeWithoutMetadata = code.substring(0, code.lastIndexOf(metaData))

  const proxyCode = SafeProxy.deployedBytecode
  const proxyCodeWithoutMetadata = proxyCode.substring(0, proxyCode.lastIndexOf(metaData))

  const safeInstance = codeWithoutMetadata === proxyCodeWithoutMetadata
  if (!safeInstance) {
    errors[FIELD_LOAD_ADDRESS] = SAFE_INSTANCE_ERROR

    return errors
  }

  // check mastercopy
  const proxy = contract(SafeProxy)
  proxy.setProvider(web3.currentProvider)
  const proxyInstance = proxy.at(safeAddress)
  const proxyImplementation = await proxyInstance.implementation()

  const safeMaster = await getSafeMasterContract()
  const masterCopy = safeMaster.address

  const sameMasterCopy = proxyImplementation === masterCopy
  if (!sameMasterCopy) {
    errors[FIELD_LOAD_ADDRESS] = SAFE_MASTERCOPY_ERROR
  }

  return errors
}

const Details = ({ classes, errors }: Props) => (
  <React.Fragment>
    <Block margin="sm">
      <Paragraph noMargin size="md" color="primary">
        Adding an existing Safe only requires the Safe address. Optionally you can give it a name.
        In case your connected client is not the owner of the Safe, the interface will essentially provide you a
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
      <Field
        name={FIELD_LOAD_ADDRESS}
        component={TextField}
        inputAdornment={noErrorsOn(FIELD_LOAD_ADDRESS, errors) && {
          endAdornment: (
            <InputAdornment position="end">
              <CheckCircle className={classes.check} />
            </InputAdornment>
          ),
        }}
        type="text"
        validate={composeValidators(required, mustBeEthereumAddress)}
        placeholder="Safe Address*"
        text="Safe Address"
      />
    </Block>
  </React.Fragment>
)

const DetailsForm = withStyles(styles)(Details)

const DetailsPage = () => (controls: React$Node, { errors }: Object) => (
  <React.Fragment>
    <OpenPaper controls={controls} container={605}>
      <DetailsForm errors={errors} />
    </OpenPaper>
  </React.Fragment>
)


export default DetailsPage
