import React from 'react'

import TextareaField from 'src/components/forms/TextareaField'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import EtherscanService from 'src/logic/contractInteraction/sources/EtherscanService'

export const NO_DATA = 'no data'

const mustBeValidABI = (abi) => {
  try {
    const parsedABI = EtherscanService.extractUsefulMethods(JSON.parse(abi))

    if (parsedABI.length === 0) {
      return NO_DATA
    }
  } catch (e) {
    return []
  }
}

const ContractABI = () => (
  <Row margin="sm">
    <Col>
      <TextareaField name="abi" placeholder="ABI*" text="ABI*" type="text" validate={mustBeValidABI} />
    </Col>
  </Row>
)

export default ContractABI
