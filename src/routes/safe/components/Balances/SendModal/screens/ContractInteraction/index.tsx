import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'
import GnoForm from 'src/components/forms/GnoForm'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
import { safeSelector } from 'src/routes/safe/store/selectors'
import Buttons from './Buttons'
import ContractABI from './ContractABI'
import EthAddressInput from './EthAddressInput'
import EthValue from './EthValue'
import FormDivisor from './FormDivisor'
import FormErrorMessage from './FormErrorMessage'
import Header from './Header'
import MethodsDropdown from './MethodsDropdown'
import RenderInputParams from './RenderInputParams'
import RenderOutputParams from './RenderOutputParams'
import { abiExtractor, createTxObject, formMutators, handleSubmitError, isReadMethod, ensResolver } from './utils'

const useStyles = makeStyles(styles)

export interface CreatedTx {
  contractAddress: string
  data: string
  selectedMethod: {}
  value: string | number
}

export interface ContractInteractionProps {
  contractAddress: string
  initialValues: { contractAddress?: string }
  onClose: () => void
  onNext: (tx: CreatedTx) => void
}

const ContractInteraction = ({ contractAddress, initialValues, onClose, onNext }: ContractInteractionProps) => {
  const classes = useStyles()
  const { address: safeAddress = '' } = useSelector(safeSelector)
  let setCallResults

  React.useMemo(() => {
    if (contractAddress) {
      initialValues.contractAddress = contractAddress
    }
  }, [contractAddress, initialValues.contractAddress])

  const handleSubmit = async ({ contractAddress, selectedMethod, value, ...values }) => {
    if (value || (contractAddress && selectedMethod)) {
      try {
        const txObject = createTxObject(selectedMethod, contractAddress, values)
        const data = txObject.encodeABI()

        if (isReadMethod(selectedMethod)) {
          const result = await txObject.call({ from: safeAddress })
          setCallResults(result)

          // this was a read method, so we won't go to the 'review' screen
          return
        }

        onNext({ ...values, contractAddress, data, selectedMethod, value })
      } catch (error) {
        return handleSubmitError(error, values)
      }
    }
  }

  return (
    <>
      <Header onClose={onClose} subTitle="1 of 2" title="Contract Interaction" />
      <Hairline />
      <GnoForm
        decorators={[abiExtractor, ensResolver]}
        formMutators={formMutators}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        subscription={{ submitting: true, pristine: true }}
      >
        {(submitting, validating, rest, mutators) => {
          setCallResults = mutators.setCallResults

          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo />
                <FormDivisor />
                <EthAddressInput
                  name="contractAddress"
                  onScannedValue={mutators.setContractAddress}
                  text="Contract Address*"
                />
                <ContractABI />
                <MethodsDropdown onChange={mutators.setSelectedMethod} />
                <EthValue onSetMax={mutators.setMax} />
                <RenderInputParams />
                <RenderOutputParams />
                <FormErrorMessage />
              </Block>
              <Hairline />
              <Buttons onClose={onClose} />
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default ContractInteraction
