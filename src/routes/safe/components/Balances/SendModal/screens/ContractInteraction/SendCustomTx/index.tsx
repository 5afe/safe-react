import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Close from '@material-ui/icons/Close'

import Divider from 'src/components/Divider'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import { TextAreaField } from 'src/components/forms/TextAreaField'
import TextField from 'src/components/forms/TextField'
import { composeValidators, maxValue, minValue, mustBeFloat, mustBeHexData } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import ButtonLink from 'src/components/layout/ButtonLink'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { currentSafeEthBalance } from 'src/logic/safe/store/selectors'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'

import { styles } from './style'
import { getNativeCurrency } from 'src/config'
import { EthAddressInput } from '../EthAddressInput'
import { ensResolver, formMutators } from '../utils'
import Buttons from '../Buttons'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

export interface CreatedTx {
  contractAddress: string
  data: string
  value: string | number
}

export type CustomTxProps = {
  contractAddress?: string
}

type Props = {
  initialValues: CustomTxProps
  onClose: () => void
  onNext: (tx: CreatedTx, submit: boolean) => void
  isABI: boolean
  switchMethod: () => void
}

const useStyles = makeStyles(styles)

const SendCustomTx = ({ initialValues, isABI, onClose, onNext, switchMethod }: Props): ReactElement => {
  const classes = useStyles()
  const nativeCurrency = getNativeCurrency()
  const ethBalance = useSelector(currentSafeEthBalance)

  const saveForm = async (values) => {
    await handleSubmit(values, false)
    switchMethod()
  }

  const handleSubmit = ({ contractAddress, data, value, ...values }, submit = true) => {
    if (data || value) {
      onNext({ ...values, contractAddress, data, value }, submit)
    }
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Contract interaction
        </Paragraph>
        <Paragraph className={classes.annotation}>{getStepTitle(1, 2)}</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        decorators={[ensResolver]}
        formMutators={formMutators}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        subscription={{ submitting: true, pristine: true, values: true }}
      >
        {(submitting, validating, rest, mutators) => {
          const handleClickSendMax = () => mutators.setMax(ethBalance)
          const handleToggleAbi = () => saveForm(rest.values)
          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo />
                <Divider withArrow />
                <EthAddressInput
                  name="contractAddress"
                  onScannedValue={mutators.setContractAddress}
                  text="Contract address*"
                />
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph color="disabled" noMargin size="md">
                      Value
                    </Paragraph>
                    <ButtonLink onClick={handleClickSendMax} weight="bold">
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      component={TextField}
                      inputAdornment={{
                        endAdornment: <InputAdornment position="end">{nativeCurrency.symbol}</InputAdornment>,
                      }}
                      name="value"
                      placeholder="Value*"
                      type="text"
                      validate={composeValidators(mustBeFloat, maxValue(ethBalance || '0'), minValue(0))}
                    />
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <TextAreaField
                      name="data"
                      placeholder="Data (hex encoded)*"
                      text="Data (hex encoded)*"
                      type="text"
                      validate={mustBeHexData}
                    />
                  </Col>
                </Row>
                <Paragraph color="disabled" noMargin size="lg">
                  <Switch checked={!isABI} onChange={handleToggleAbi} />
                  Use custom data (hex encoded)
                </Paragraph>
              </Block>
              <Buttons onClose={onClose} />
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default SendCustomTx
