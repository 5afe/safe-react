// @flow
import React, { useState, useEffect } from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { onboardUser } from '~/components/ConnectButton'
import SelectField from '~/components/forms/SelectField'
import {
  composeValidators, minValue, mustBeInteger, required, differentFrom,
} from '~/components/forms/validator'
import Field from '~/components/forms/Field'
import GnoForm from '~/components/forms/GnoForm'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import type { Owner } from '~/routes/safe/store/models/owner'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { estimateTxGasCosts } from '~/logic/safe/transactions/gasNew'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  threshold: number,
  owners: List<Owner>,
  onChangeThreshold: Function,
}

const THRESHOLD_FIELD_NAME = 'threshold'

const ChangeThreshold = ({
  onClose, owners, threshold, classes, onChangeThreshold, safeAddress,
}: Props) => {
  const [gasCosts, setGasCosts] = useState<string>('< 0.001')

  useEffect(() => {
    let isCurrent = true
    const estimateGasCosts = async () => {
      const web3 = getWeb3()
      const ready = await onboardUser()
      if (!ready) return
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

  const handleSubmit = (values) => {
    const newThreshold = values[THRESHOLD_FIELD_NAME]

    onClose()
    onChangeThreshold(newThreshold)
  }

  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.headingText} weight="bolder" noMargin>
          Change required confirmations
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit} initialValues={{ threshold: threshold.toString() }}>
        {() => (
          <>
            <Block className={classes.modalContent}>
              <Row>
                <Paragraph weight="bolder">Any transaction requires the confirmation of:</Paragraph>
              </Row>
              <Row margin="xl" align="center" className={classes.inputRow}>
                <Col xs={2}>
                  <Field
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
                          <Paragraph className={classes.errorText} noMargin color="error">
                            {props.meta.error}
                          </Paragraph>
                        )}
                      </>
                    )}
                    validate={composeValidators(required, mustBeInteger, minValue(1), differentFrom(threshold))}
                    data-testid="threshold-select-input"
                  />
                </Col>
                <Col xs={10}>
                  <Paragraph size="lg" color="primary" noMargin className={classes.ownersText}>
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
              <Button type="submit" color="primary" minWidth={140} variant="contained">
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
