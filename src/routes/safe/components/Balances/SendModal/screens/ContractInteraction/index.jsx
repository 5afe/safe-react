// @flow
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { styles } from './style'

import GnoForm from '~/components/forms/GnoForm'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import Buttons from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/Buttons'
import ContractABI from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/ContractABI'
import EthAddressInput from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/EthAddressInput'
import EthValue from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/EthValue'
import FormDivisor from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/FormDivisor'
import Header from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/Header'
import MethodsDropdown from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/MethodsDropdown'
import RenderInputParams from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/RenderInputParams'
import RenderOutputParams from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/RenderOutputParams'
import {
  abiExtractor,
  createTxObject,
  formMutators,
} from '~/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'

type Props = {
  initialValues: Object,
  onClose: () => void,
  onNext: (any) => void,
  contractAddress?: string,
}

const useStyles = makeStyles(styles)

const ContractInteraction = ({ contractAddress, initialValues, onClose, onNext }: Props) => {
  const classes = useStyles()

  React.useMemo(() => {
    if (contractAddress) {
      initialValues.contractAddress = contractAddress
    }
  }, [contractAddress])

  const handleSubmit = async ({ contractAddress, selectedMethod, value, ...values }: {}) => {
    if (value || (contractAddress && selectedMethod)) {
      const data = await createTxObject(selectedMethod, contractAddress, values).encodeABI()
      onNext({ contractAddress, data, selectedMethod, value, ...values })
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
                <EthValue onSetMax={mutators.setMax} />
                <ContractABI />
                <MethodsDropdown onChange={mutators.setSelectedMethod} />
                <RenderInputParams />
                <RenderOutputParams />
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
