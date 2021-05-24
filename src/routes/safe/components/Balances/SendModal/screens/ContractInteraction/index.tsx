import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'
import Switch from '@material-ui/core/Switch'
import { styles } from './style'
import Divider from 'src/components/Divider'
import GnoForm from 'src/components/forms/GnoForm'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import Paragraph from 'src/components/layout/Paragraph'
import Buttons from './Buttons'
import ContractABI from './ContractABI'
import { EthAddressInput } from './EthAddressInput'
import FormErrorMessage from './FormErrorMessage'
import { Header } from './Header'
import { MethodsDropdown } from './MethodsDropdown'
import { RenderInputParams } from './RenderInputParams'
import { RenderOutputParams } from './RenderOutputParams'
import { createTxObject, formMutators, handleSubmitError, isReadMethod, ensResolver } from './utils'
import { TransactionReviewType } from './Review'
import { NativeCoinValue } from './NativeCoinValue'

const useStyles = makeStyles(styles)

export interface CreatedTx {
  contractAddress: string
  data: string
  selectedMethod: TransactionReviewType
  value: string | number
}

export type ContractInteractionTx = {
  contractAddress?: string
}

export interface ContractInteractionProps {
  contractAddress?: string
  initialValues: ContractInteractionTx
  isABI: boolean
  onClose: () => void
  switchMethod: () => void
  onNext: (tx: CreatedTx, submit: boolean) => void
}

const ContractInteraction: React.FC<ContractInteractionProps> = ({
  contractAddress,
  initialValues,
  onClose,
  onNext,
  switchMethod,
  isABI,
}) => {
  const classes = useStyles()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  let setCallResults

  React.useMemo(() => {
    if (contractAddress) {
      initialValues.contractAddress = contractAddress
    }
  }, [contractAddress, initialValues])

  const saveForm = async (values: CreatedTx): Promise<void> => {
    await handleSubmit(values, false)
    switchMethod()
  }

  const handleSubmit = async (
    { contractAddress, selectedMethod, value, ...values },
    submit = true,
  ): Promise<void | Record<string, string>> => {
    if (value || (contractAddress && selectedMethod)) {
      try {
        const txObject = createTxObject(selectedMethod, contractAddress, values)
        const data = txObject.encodeABI()

        if (isReadMethod(selectedMethod) && submit) {
          const result = await txObject.call({ from: safeAddress })
          setCallResults(result)

          // this was a read method, so we won't go to the 'review' screen
          return
        }

        onNext({ ...values, contractAddress, data, selectedMethod, value }, submit)
      } catch (error) {
        return handleSubmitError(error, values)
      }
    }
  }

  return (
    <>
      <Header onClose={onClose} subTitle="1 of 2" title="Contract interaction" />
      <Hairline />
      <GnoForm
        decorators={[ensResolver]}
        formMutators={formMutators}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        subscription={{ submitting: true, pristine: true, values: true }}
      >
        {(submitting, validating, rest, mutators) => {
          setCallResults = mutators.setCallResults
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
                <ContractABI />
                <MethodsDropdown onChange={mutators.setSelectedMethod} />
                <NativeCoinValue onSetMax={mutators.setMax} />
                <RenderInputParams />
                <RenderOutputParams />
                <FormErrorMessage />
                <Paragraph color="disabled" noMargin size="lg" style={{ letterSpacing: '-0.5px' }}>
                  <Switch checked={!isABI} onChange={() => saveForm(rest.values)} />
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

export default ContractInteraction
