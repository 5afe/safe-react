// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import GnoForm from '~/components/forms/GnoForm'
import { connect } from 'react-redux'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import { composeValidators, minValue, maxValue, mustBeInteger, required } from '~/components/forms/validator'
import { getSafeEthereumInstance, createTransaction } from '~/routes/safe/component/AddTransaction/createTransactions'
import { sleep } from '~/utils/timer'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = SelectorProps & Actions & {
  numOwners: number,
  safe: Safe,
  onReset: () => void,
}

const THRESHOLD_PARAM = 'threshold'

const ThresholdComponent = ({ numOwners, safe }: Props) => () => (
  <Block margin="md">
    <Heading tag="h2" margin="lg">
      {'Change safe\'s threshold'}
    </Heading>
    <Heading tag="h4" margin="lg">
      {`Safe's owners: ${numOwners} and Safe's threshold: ${safe.get('confirmations')}`}
    </Heading>
    <Block margin="md">
      <Field
        name={THRESHOLD_PARAM}
        component={TextField}
        type="text"
        validate={composeValidators(
          required,
          mustBeInteger,
          minValue(1),
          maxValue(numOwners),
        )}
        placeholder="New threshold"
        text="Safe's threshold"
      />
    </Block>
  </Block>
)

type State = {
  initialValues: Object,
}

class Threshold extends React.PureComponent<Props, State> {
  state = {
    initialValues: {},
  }

  onThreshold = async (values: Object) => {
    const { safe, userAddress } = this.props // , fetchThreshold } = this.props
    const newThreshold = values[THRESHOLD_PARAM]
    const gnosisSafe = await getSafeEthereumInstance(safe.get('address'))
    const nonce = Date.now()
    const data = gnosisSafe.contract.changeThreshold.getData(newThreshold)
    await createTransaction(safe, `Change Safe's threshold [${nonce}]`, safe.get('address'), 0, nonce, userAddress, data)
    await sleep(1500)
    this.props.fetchTransactions()
    this.props.fetchThreshold(safe.get('address'))
  }

  render() {
    const { numOwners, onReset, safe } = this.props

    return (
      <GnoForm
        onSubmit={this.onThreshold}
        render={ThresholdComponent({ numOwners, safe })}
        padding={15}
        initialValues={this.state.initialValues}
      >
        {(submitting: boolean, submitSucceeded: boolean) => (
          <Row align="end" margin="lg" grow>
            <Col xs={12} center="xs">
              <Button
                variant="raised"
                color="primary"
                onClick={submitSucceeded ? onReset : undefined}
                type={submitSucceeded ? 'button' : 'submit'}
                disabled={submitting}
              >
                { submitSucceeded ? 'VISIT TXs' : 'FINISH' }
              </Button>
            </Col>
          </Row>
        )}
      </GnoForm>
    )
  }
}

export default connect(selector, actions)(Threshold)
