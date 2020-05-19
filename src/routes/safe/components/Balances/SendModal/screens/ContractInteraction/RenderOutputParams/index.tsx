import React from 'react'
import { useField } from 'react-final-form'

import TextField from 'src/components/forms/TextField'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'

const RenderOutputParams = () => {
  const {
    input: { value: method },
  }: any = useField('selectedMethod', { value: true })
  const {
    input: { value: results },
  }: any = useField('callResults', { value: true })
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

export default RenderOutputParams
