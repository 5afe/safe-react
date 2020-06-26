import InputAdornment from '@material-ui/core/InputAdornment'
import { withStyles } from '@material-ui/core/styles'
import CheckCircle from '@material-ui/icons/CheckCircle'
import * as React from 'react'

import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import OpenPaper from 'src/components/Stepper/OpenPaper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { mustBeEthereumAddress, noErrorsOn, required } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { SAFE_MASTER_COPY_ADDRESS_V10, getSafeMasterContract, validateProxy } from 'src/logic/contracts/safeContracts'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { FIELD_LOAD_ADDRESS, FIELD_LOAD_NAME } from 'src/routes/load/components/fields'
import { secondary } from 'src/theme/variables'

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
export const safeFieldsValidation = async (values) => {
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

const Details = ({ classes, errors, form }) => {
  const handleScan = (value, closeQrModal) => {
    form.mutators.setValue(FIELD_LOAD_ADDRESS, value)
    closeQrModal()
  }
  return (
    <>
      <Block margin="md">
        <Paragraph color="primary" noMargin size="md">
          You are about to load an existing Gnosis Safe. First, choose a name and enter the Safe address. The name is
          only stored locally and will never be shared with Gnosis or any third parties.
          <br />
          Your connected wallet does not have to be the owner of this Safe. In this case, the interface will provide you
          a read-only view.
        </Paragraph>
      </Block>
      <Block className={classes.root}>
        <Col xs={11}>
          <Field
            component={TextField}
            name={FIELD_LOAD_NAME}
            placeholder="Name of the Safe"
            text="Safe name"
            type="text"
            validate={required}
            testId="load-safe-name-field"
          />
        </Col>
      </Block>
      <Block className={classes.root} margin="lg">
        <Col xs={11}>
          <AddressInput
            component={TextField}
            fieldMutator={(val) => {
              form.mutators.setValue(FIELD_LOAD_ADDRESS, val)
            }}
            inputAdornment={
              noErrorsOn(FIELD_LOAD_ADDRESS, errors) && {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckCircle className={classes.check} data-testid="valid-address" />
                  </InputAdornment>
                ),
              }
            }
            name={FIELD_LOAD_ADDRESS}
            placeholder="Safe Address*"
            text="Safe Address"
            type="text"
            testId="load-safe-address-field"
          />
        </Col>
        <Col center="xs" className={classes} middle="xs" xs={1}>
          <ScanQRWrapper handleScan={handleScan} />
        </Col>
      </Block>
      <Block margin="sm">
        <Paragraph className={classes.links} color="primary" noMargin size="md">
          By continuing you consent with the{' '}
          <a href="https://safe.gnosis.io/terms" rel="noopener noreferrer" target="_blank">
            terms of use
          </a>{' '}
          and{' '}
          <a href="https://safe.gnosis.io/privacy" rel="noopener noreferrer" target="_blank">
            privacy policy
          </a>
          . Most importantly, you confirm that your funds are held securely in the Gnosis Safe, a smart contract on the
          Ethereum blockchain. These funds cannot be accessed by Gnosis at any point.
        </Paragraph>
      </Block>
    </>
  )
}

const DetailsForm = withStyles(styles as any)(Details)

const DetailsPage = () => (controls, { errors, form }) => (
  <>
    <OpenPaper controls={controls}>
      <DetailsForm errors={errors} form={form} />
    </OpenPaper>
  </>
)

export default DetailsPage
