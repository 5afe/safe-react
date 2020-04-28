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
import { useSelector } from 'react-redux'

import ArrowDown from '../assets/arrow-down.svg'

import { styles } from './style'

import QRIcon from '~/assets/icons/qrcode.svg'
import ScanQRModal from '~/components/ScanQRModal'
import GnoCheckbox from '~/components/forms/Checkbox'
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
    abi: (contractAddress) => {
      if (!contractAddress) {
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
    utils.changeValue(state, 'selectedMethod', () => args[0])
  },
}

const MENU_WIDTH = '452px'
const MethodsDropdown = ({ abi, onChange }: { abi: ?string, onChange: (any) => void }) => {
  const classes = useDropdownStyles({ buttonWidth: MENU_WIDTH })
  const [methodSelected, setMethodSelected] = useState('')
  const [methodsList, setMethodsList] = useState([])
  const [methodsListFiltered, setMethodsListFiltered] = useState([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchParams, setSearchParams] = useState('')

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

  return (
    <MuiThemeProvider theme={DropdownListTheme}>
      <>
        <button className={classes.button} onClick={handleClick} type="button">
          <span className={classNames(classes.buttonInner, anchorEl && classes.openMenuButton)}>{methodSelected}</span>
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
  )
}

const RenderOutputParams = ({ method, result }) => {
  const multipleResults = method.outputs.length > 1

  return method.outputs.map(({ name, type }, index) => {
    const placeholder = name ? `${name} (${type})` : type
    const key = `${method.name}_${index}_${type}`

    return (
      <Field
        component={TextField}
        disabled
        initialValue={multipleResults ? result[index] : result}
        key={key}
        name={key}
        placeholder={placeholder}
        testId={`methodCallResult-${key}`}
        text={placeholder}
        type="text"
      />
    )
  })
}

const RenderReadCallResult = ({ contractAddress, method }: { contractAddress: string, method: any }) => {
  const [callResult, setCallResult] = React.useState(null)
  const web3 = getWeb3()

  React.useMemo(() => {
    setCallResult(null)

    const call = async () => {
      const contract = new web3.eth.Contract([method], contractAddress)
      const result = await contract.methods[method.name]().call()
      setCallResult(result)
    }

    call()
  }, [method, contractAddress])

  return callResult ? <RenderOutputParams method={method} result={callResult} /> : null
}

const ContractInteraction = ({ contractAddress, initialValues, onClose, onNext }: Props) => {
  const classes = useStyles()
  const { address: safeAddress, ethBalance, name: safeName } = useSelector(safeSelector)
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)

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

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
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
      >
        {(submitting, validating, rest) => {
          const { form, valid } = rest
          const { mutators } = form

          const handleScan = (value) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setContractAddress(scannedAddress)
            closeQrModal()
          }

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
                    <TextareaField name="abi" placeholder="ABI*" text="ABI*" type="text" />
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col end="sm">
                    <Field name="abi" subscription={{ value: true }}>
                      {({ input: { value } }) => (
                        <label htmlFor="interactWithABI">
                          Interact with Contract?{' '}
                          <Field component={GnoCheckbox} disabled={!value} name="interactWithABI" type="checkbox" />
                        </label>
                      )}
                    </Field>
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <Field name="interactWithABI" subscription={{ value: true }}>
                      {({ input: { value } }) =>
                        value === true ? (
                          <MethodsDropdown abi={rest.values.abi} onChange={mutators.setSelectedMethod} />
                        ) : null
                      }
                    </Field>
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <Field name="selectedMethod" subscription={{ value: true }}>
                      {({ input: { value } }) => {
                        if (!!value && value.action === 'read' && value.inputs.length === 0) {
                          return <RenderReadCallResult contractAddress={rest.values.contractAddress} method={value} />
                        }

                        return null
                      }}
                    </Field>
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  className={classes.submitButton}
                  color="primary"
                  data-testid="review-tx-btn"
                  disabled={submitting || validating || !valid}
                  minWidth={140}
                  type="submit"
                  variant="contained"
                >
                  Review
                </Button>
              </Row>
              {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={closeQrModal} onScan={handleScan} />}
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default ContractInteraction
