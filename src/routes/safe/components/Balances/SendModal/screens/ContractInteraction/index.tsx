import { makeStyles } from '@material-ui/core/styles'
import { FORM_ERROR } from 'final-form'
import React from 'react'

import { styles } from './style'
import GnoForm from 'src/components/forms/GnoForm'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import SafeInfo from 'src/routes/safe/components/Balances/SendModal/SafeInfo'
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
import { abiExtractor, createTxObject, formMutators } from './utils'

const useStyles = makeStyles(styles as any)

const ContractInteraction = ({ contractAddress, initialValues, onClose, onNext }) => {
  const classes = useStyles()

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
        await txObject.estimateGas()
        onNext({ contractAddress, data, selectedMethod, value, ...values })
      } catch (e) {
        for (const key in values) {
          if (values.hasOwnProperty(key) && values[key] === e.value) {
            return { [key]: e.reason }
          }
        }

        // .estimateGas() failed
        return { [FORM_ERROR]: e.message }
      }
    }
  }

  return (
    <>
      <Header onClose={onClose} subTitle="1 of 2" title="Contract Interaction" />
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
              <Buttons onCallSubmit={mutators.setCallResults} onClose={onClose} />
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default ContractInteraction
