import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { styles } from './style'

import GnoForm from 'src/components/forms/GnoForm'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getUpgradeSafeTransactionHash } from 'src/logic/safe/utils/upgradeSafe'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { makeStyles } from '@material-ui/core'
import { TransactionFees } from 'src/components/TransactionsFees'
import { useEstimateTransactionGas } from 'src/logic/hooks/useEstimateTransactionGas'
import { MULTI_SEND_ADDRESS } from 'src/logic/contracts/safeContracts'
import { DELEGATE_CALL } from 'src/logic/safe/transactions'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'

const useStyles = makeStyles(styles)

type Props = {
  onClose: () => void
  safeAddress: string
}

export const UpdateSafeModal = ({ onClose, safeAddress }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [multiSendCallData, setMultiSendCallData] = useState(EMPTY_DATA)

  useEffect(() => {
    const calculateUpgradeSafeModal = async () => {
      const encodeMultiSendCallData = await getUpgradeSafeTransactionHash(safeAddress)
      setMultiSendCallData(encodeMultiSendCallData)
    }
    calculateUpgradeSafeModal()
  }, [safeAddress])

  const handleSubmit = async () => {
    // Call the update safe method
    dispatch(
      createTransaction({
        safeAddress,
        to: MULTI_SEND_ADDRESS,
        valueInWei: '0',
        txData: multiSendCallData,
        notifiedTransaction: 'STANDARD_TX',
        operation: DELEGATE_CALL,
      }),
    )
    onClose()
  }

  const {
    gasCostFormatted,
    txEstimationExecutionStatus,
    isExecution,
    isCreation,
    isOffChainSignature,
  } = useEstimateTransactionGas({
    txData: multiSendCallData,
    txRecipient: safeAddress,
  })

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight="bolder">
          Update to new Safe version
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.modalContent}>
              <Row>
                <Paragraph>
                  Update now to take advantage of new features and the highest security standards available.
                </Paragraph>
                <Block>
                  This update includes:
                  <ul>
                    <li>Compatibility with new asset types (ERC-721 / ERC-1155)</li>
                    <li>Improved interoperability with modules</li>
                    <li>Minor security improvements</li>
                  </ul>
                </Block>
                <Paragraph>
                  You will need to confirm this update just like any other transaction. This means other owners will
                  have to confirm the update in case more than one confirmation is required for this Safe.
                </Paragraph>
              </Row>
              <Row>
                <TransactionFees
                  gasCostFormatted={gasCostFormatted}
                  isExecution={isExecution}
                  isCreation={isCreation}
                  isOffChainSignature={isOffChainSignature}
                  txEstimationExecutionStatus={txEstimationExecutionStatus}
                />
              </Row>
            </Block>
            <Hairline style={{ position: 'absolute', bottom: 85 }} />
            <Row align="center" className={classes.buttonRow}>
              <Button minWidth={140} onClick={onClose}>
                Back
              </Button>
              <Button color="primary" minWidth={140} type="submit" variant="contained">
                Update Safe
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}
