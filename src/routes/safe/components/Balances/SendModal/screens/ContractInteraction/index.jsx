// @flow
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputBase from '@material-ui/core/InputBase'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import classNames from 'classnames'
import createDecorator from 'final-form-calculate'
import React, { useState } from 'react'
import { useField, useFormState } from 'react-final-form'
import { useSelector } from 'react-redux'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

import QRIcon from '~/assets/icons/qrcode.svg'
import ScanQRModal from '~/components/ScanQRModal'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import TextField from '~/components/forms/TextField'
import TextareaField from '~/components/forms/TextareaField'
import {
  composeValidators,
  maxValue,
  mustBeEthereumAddress,
  mustBeEthereumContractAddress,
  mustBeFloat,
  required,
} from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import ButtonLink from '~/components/layout/ButtonLink'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { getNetwork } from '~/config'
import { getConfiguredSource } from '~/logic/contractInteraction/sources'
import EtherscanService from '~/logic/contractInteraction/sources/EtherscanService'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import CheckIcon from '~/routes/safe/components/DropdownCurrency/img/check.svg'
import { useDropdownStyles } from '~/routes/safe/components/DropdownCurrency/style'
import { safeSelector } from '~/routes/safe/store/selectors'
import { DropdownListTheme } from '~/theme/mui'
import { sm } from '~/theme/variables'

type Props = {
  initialValues: Object,
  onClose: () => void,
  onNext: (any) => void,
  contractAddress?: string,
}

const useStyles = makeStyles(styles)

const abiExtractor = createDecorator({
  field: 'contractAddress',
  updates: {
    abi: async (contractAddress) => {
      if (
        !contractAddress ||
        mustBeEthereumAddress(contractAddress) ||
        (await mustBeEthereumContractAddress(contractAddress))
      ) {
        return 'no contract'
      }
      const network = getNetwork()
      const source = getConfiguredSource()
      return source.getContractABI(contractAddress, network)
    },
  },
})

const formMutators = {
  setMax: (args, state, utils) => {
    utils.changeValue(state, 'value', () => args[0])
  },
  setContractAddress: (args, state, utils) => {
    utils.changeValue(state, 'contractAddress', () => args[0])
  },
  setSelectedMethod: (args, state, utils) => {
    const modified =
      state.lastFormState.values.selectedMethod && state.lastFormState.values.selectedMethod.name !== args[0].name

    if (modified) {
      utils.changeValue(state, 'callResults', () => '')
    }

    utils.changeValue(state, 'selectedMethod', () => args[0])
  },
  setCallResults: (args, state, utils) => {
    utils.changeValue(state, 'callResults', () => args[0])
  },
}

const mustBeValidABI = (abi: string) => {
  try {
    const parsedABI = EtherscanService.extractUsefulMethods(JSON.parse(abi))

    if (parsedABI.length === 0) {
      return 'no data'
    }
  } catch (e) {
    return e.message
  }
}

const MENU_WIDTH = '452px'
const MethodsDropdown = ({ onChange }: { onChange: (any) => void }) => {
  const classes = useDropdownStyles({ buttonWidth: MENU_WIDTH })
  const [methodSelected, setMethodSelected] = useState('')
  const [methodsList, setMethodsList] = useState([])
  const [methodsListFiltered, setMethodsListFiltered] = useState([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchParams, setSearchParams] = useState('')
  const {
    input: { value: abi },
    meta: { valid },
  } = useField('abi', { value: true, valid: true })

  React.useEffect(() => {
    if (abi) {
      try {
        setMethodsList(EtherscanService.extractUsefulMethods(JSON.parse(abi)))
      } catch (e) {
        setMethodsList([])
      }
    }
  }, [abi])

  React.useMemo(() => {
    setMethodsListFiltered(methodsList.filter(({ name }) => name.toLowerCase().includes(searchParams.toLowerCase())))
  }, [methodsList, searchParams])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onMethodSelectedChanged = (newMethodSelected) => {
    setMethodSelected(newMethodSelected)
    onChange(methodsList.find(({ name }) => name === newMethodSelected))
    handleClose()
  }

  return !valid || !abi || abi === 'no contract' ? null : (
    <Row margin="sm">
      <Col>
        <MuiThemeProvider theme={DropdownListTheme}>
          <>
            <button className={classes.button} onClick={handleClick} type="button">
              <span className={classNames(classes.buttonInner, anchorEl && classes.openMenuButton)}>
                {methodSelected}
              </span>
            </button>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
              }}
              elevation={0}
              getContentAnchorEl={null}
              id="customizedMenu"
              keepMounted
              onClose={handleClose}
              open={!!anchorEl}
              PaperProps={{ style: { width: MENU_WIDTH } }}
              rounded={0}
              transformOrigin={{
                horizontal: 'center',
                vertical: 'top',
              }}
            >
              <MenuItem className={classes.listItemSearch} key="0">
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={(event) => setSearchParams(event.target.value)}
                    placeholder="Search…"
                    value={searchParams}
                  />
                </div>
              </MenuItem>
              <div className={classes.dropdownItemsScrollWrapper}>
                {methodsListFiltered.map(({ action, name }) => (
                  <MenuItem
                    className={classes.listItem}
                    key={name}
                    onClick={() => onMethodSelectedChanged(name)}
                    value={name}
                  >
                    <ListItemText primary={name} />
                    <ListItemIcon className={classes.iconRight}>
                      {name === methodSelected ? <img alt="checked" src={CheckIcon} /> : <span />}
                    </ListItemIcon>
                    <ListItemIcon className={classes.iconRight}>
                      <div>{action}</div>
                    </ListItemIcon>
                  </MenuItem>
                ))}
              </div>
            </Menu>
          </>
        </MuiThemeProvider>
      </Col>
    </Row>
  )
}

const RenderInputParams = () => {
  const {
    meta: { valid: validABI },
  } = useField('abi', { valid: true })
  const {
    input: { value: method },
  } = useField('selectedMethod', { value: true })
  const renderInputs = validABI && !!method && method.inputs.length

  return !renderInputs
    ? null
    : method.inputs.map(({ name, type }, index) => {
        const placeholder = name ? `${name} (${type})` : type
        const key = `methodInput-${method.name}_${index}_${type}`
        const validate = type === 'address' ? composeValidators(required, mustBeEthereumAddress) : required

        return (
          <Row key={key} margin="sm">
            <Col>
              <Field
                component={TextField}
                name={key}
                placeholder={placeholder}
                testId={key}
                text={placeholder}
                type="text"
                validate={validate}
              />
            </Col>
          </Row>
        )
      })
}

const RenderOutputParams = () => {
  const {
    input: { value: method },
  } = useField('selectedMethod', { value: true })
  const {
    input: { value: results },
  } = useField('callResults', { value: true })
  const multipleResults = !!method && method.outputs.length > 1

  return results
    ? method.outputs.map(({ name, type }, index) => {
        const placeholder = name ? `${name} (${type})` : type
        const key = `methodCallResult-${method.name}_${index}_${type}`
        const value = multipleResults ? results[index] : results

        return (
          <Row key={key} margin="sm">
            <Col>
              <TextField
                disabled
                input={{ name: key, value, placeholder, type: 'text' }}
                meta={{ valid: true }}
                testId={key}
                text={placeholder}
              />
            </Col>
          </Row>
        )
      })
    : null
}

const ContractAddress = ({ onScannedValue }: { onScannedValue: () => void }) => {
  const classes = useStyles()
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const handleScan = (value) => {
    let scannedAddress = value

    if (scannedAddress.startsWith('ethereum:')) {
      scannedAddress = scannedAddress.replace('ethereum:', '')
    }

    onScannedValue(scannedAddress)
    closeQrModal()
  }

  return (
    <>
      <Row margin="md">
        <Col xs={11}>
          <Field
            component={TextField}
            name="contractAddress"
            placeholder="Contract Address*"
            testId="contractInteraction-contractAddress"
            text="Contract Address*"
            type="text"
            validate={composeValidators(required, mustBeEthereumAddress, mustBeEthereumContractAddress)}
          />
        </Col>
        <Col center="xs" className={classes} middle="xs" xs={1}>
          <Img
            alt="Scan QR"
            className={classes.qrCodeBtn}
            height={20}
            onClick={openQrModal}
            role="button"
            src={QRIcon}
          />
        </Col>
      </Row>
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
    </>
  )
}

const ContractInteractionButtons = ({
  onCallSubmit,
  onClose,
}: {
  onCallSubmit: (string) => void,
  onClose: () => void,
}) => {
  const web3 = getWeb3()
  const classes = useStyles()
  const {
    input: { value: method },
  } = useField('selectedMethod', { value: true })
  const {
    input: { value: contractAddress },
  } = useField('contractAddress', { valid: true })
  const { submitting, valid, validating, values } = useFormState({
    subscription: { submitting: true, valid: true, values: true, validating: true },
  })

  const handleCallSubmit = async () => {
    const contract = new web3.eth.Contract([method], contractAddress)
    const { inputs, name } = method
    const args = inputs.map(({ type }, index) => values[`methodInput-${name}_${index}_${type}`])
    const results = await contract.methods[name](...args).call()

    onCallSubmit(results)
  }

  return (
    <Row align="center" className={classes.buttonRow}>
      <Button minWidth={140} onClick={onClose}>
        Cancel
      </Button>
      {method && method.action === 'read' ? (
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="review-tx-btn"
          disabled={validating || !valid}
          minWidth={140}
          onClick={handleCallSubmit}
          variant="contained"
        >
          Call
        </Button>
      ) : (
        <Button
          className={classes.submitButton}
          color="primary"
          data-testid="review-tx-btn"
          disabled={submitting || validating || !valid || !method || method.action === 'read'}
          minWidth={140}
          type="submit"
          variant="contained"
        >
          Review
        </Button>
      )}
    </Row>
  )
}

const ContractInteraction = ({ contractAddress, initialValues, onClose, onNext }: Props) => {
  const classes = useStyles()
  const { address: safeAddress, ethBalance, name: safeName } = useSelector(safeSelector)

  React.useMemo(() => {
    if (contractAddress) {
      initialValues.contractAddress = contractAddress
    }
  }, [contractAddress])

  const handleSubmit = ({ contractAddress, methodArguments, methodCalled, value }: {}) => {
    if (value || (methodCalled && methodArguments)) {
      onNext({ contractAddress, value, methodCalled, methodArguments })
    }
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Contract Interaction
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        decorators={[abiExtractor]}
        formMutators={formMutators}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        subscription={{ submitting: true, pristine: true }}
      >
        {(submitting, validating, rest, mutators) => {
          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo ethBalance={ethBalance} safeAddress={safeAddress} safeName={safeName} />
                <Row margin="md">
                  <Col xs={1}>
                    <img alt="Arrow Down" src={ArrowDown} style={{ marginLeft: sm }} />
                  </Col>
                  <Col center="xs" layout="column" xs={11}>
                    <Hairline />
                  </Col>
                </Row>
                <ContractAddress onScannedValue={mutators.setContractAddress} />
                <Row className={classes.fullWidth} margin="xs">
                  <Paragraph color="disabled" noMargin size="md" style={{ letterSpacing: '-0.5px' }}>
                    Value
                  </Paragraph>
                  <ButtonLink onClick={() => mutators.setMax(ethBalance)} weight="bold">
                    Send max
                  </ButtonLink>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      className={classes.addressInput}
                      component={TextField}
                      inputAdornment={{
                        endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
                      }}
                      name="value"
                      placeholder="Value"
                      text="Value"
                      type="text"
                      validate={composeValidators(mustBeFloat, maxValue(ethBalance))}
                    />
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <TextareaField name="abi" placeholder="ABI*" text="ABI*" type="text" validate={mustBeValidABI} />
                  </Col>
                </Row>
                <MethodsDropdown onChange={mutators.setSelectedMethod} />
                <RenderInputParams />
                <RenderOutputParams />
              </Block>
              <Hairline />
              <ContractInteractionButtons onCallSubmit={mutators.setCallResults} onClose={onClose} />
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default ContractInteraction
