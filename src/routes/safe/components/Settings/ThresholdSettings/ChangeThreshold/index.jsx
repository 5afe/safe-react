// @flow
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { List } from 'immutable'
import React, { useEffect, useState } from 'react'

import { styles } from './style'

import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import SelectField from '~/components/forms/SelectField'
import { composeValidators, differentFrom, minValue, mustBeInteger, required } from '~/components/forms/validator'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Col from '~/components/layout/Col'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import type { Owner } from '~/routes/safe/store/models/owner'

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  threshold: number,
  owners: List<Owner>,
  onChangeThreshold: Function,
}

const THRESHOLD_FIELD_NAME = 'threshold'

const ChangeThreshold = ({ classes, onChangeThreshold, onClose, owners, safeAddress, threshold }: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')

  useEffect(() => {
    let isCurrent = true
    const estimateGasCosts = async () => {
      const web3 = getWeb3()
      const { fromWei, toBN } = web3.utils

      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
      const txData = safeInstance.contract.methods.changeThreshold('1').encodeABI()
      const estimatedGasCosts = await estimateTxGasCosts(safeAddress, safeAddress, txData)
      const gasCostsAsEth = fromWei(toBN(estimatedGasCosts), 'ether')
      const formattedGasCosts = formatAmount(gasCostsAsEth)
      if (isCurrent) {
        setGasCosts(formattedGasCosts)
      }
    }

    estimateGasCosts()

    return () => {
      isCurrent = false
    }
  }, [])

  const handleSubmit = values => {
    const newThreshold = values[THRESHOLD_FIELD_NAME]

    onClose()
    onChangeThreshold(newThreshold)
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          Change required confirmations
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm initialValues={{ threshold: threshold.toString() }} onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.modalContent}>
              <Row>
                <Paragraph weight="bolder">Any transaction requires the confirmation of:</Paragraph>
              </Row>
              <Row align="center" className={classes.inputRow} margin="xl">
                <Col xs={2}>
                  <Field
                    data-testid="threshold-select-input"
                    name={THRESHOLD_FIELD_NAME}
                    render={(props: Object) => (
                      <>
                        <SelectField {...props} disableError>
                          {[...Array(Number(owners.size))].map((x, index) => (
                            <MenuItem key={index} value={`${index + 1}`}>
                              {index + 1}
                            </MenuItem>
                          ))}
                        </SelectField>
                        {props.meta.error && props.meta.touched && (
                          <Paragraph className={classes.errorText} color="error" noMargin>
                            {props.meta.error}
                          </Paragraph>
                        )}
                      </>
                    )}
                    validate={composeValidators(required, mustBeInteger, minValue(1), differentFrom(threshold))}
                  />
                </Col>
                <Col xs={10}>
                  <Paragraph className={classes.ownersText} color="primary" noMargin size="lg">
                    {`out of ${owners.size} owner(s)`}
                  </Paragraph>
                </Col>
              </Row>
              <Row>
                <Paragraph>
                  {`You're about to create a transaction and will have to confirm it with your currently connected wallet. Make sure you have ${gasCosts} (fee price) ETH in this wallet to fund this confirmation.`}
                </Paragraph>
              </Row>
            </Block>
            <Hairline style={{ position: 'absolute', bottom: 85 }} />
            <Row align="center" className={classes.buttonRow}>
              <Button minWidth={140} onClick={onClose}>
                BACK
              </Button>
              <Button color="primary" minWidth={140} type="submit" variant="contained">
                CHANGE
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(ChangeThreshold)
