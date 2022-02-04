import { Operation } from '@gnosis.pm/safe-react-gateway-sdk'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { LATEST_SAFE_VERSION } from 'src/utils/constants'
import Link from 'src/components/layout/Link'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getUpgradeSafeTransactionHash } from 'src/logic/safe/utils/upgradeSafe'
import { createTransaction } from 'src/logic/safe/store/actions/createTransaction'
import { getMultisendContractAddress } from 'src/logic/contracts/safeContracts'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { TxModalWrapper } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'

import { useStyles } from './style'

type Props = {
  onClose: () => void
  safeAddress: string
  safeCurrentVersion: string
}

export const UpdateSafeModal = ({ onClose, safeAddress, safeCurrentVersion }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [multiSendCallData, setMultiSendCallData] = useState(EMPTY_DATA)

  useEffect(() => {
    const encodeMultiSendCallData = getUpgradeSafeTransactionHash(safeAddress, safeCurrentVersion)
    setMultiSendCallData(encodeMultiSendCallData)
  }, [safeAddress, safeCurrentVersion])

  const handleSubmit = (txParameters: TxParameters, delayExecution: boolean) => {
    // Call the update safe method
    dispatch(
      createTransaction({
        safeAddress,
        to: getMultisendContractAddress(),
        valueInWei: '0',
        txData: multiSendCallData,
        txNonce: txParameters.safeNonce,
        safeTxGas: txParameters.safeTxGas,
        ethParameters: txParameters,
        notifiedTransaction: 'STANDARD_TX',
        operation: Operation.DELEGATE,
        delayExecution,
      }),
    )
    onClose()
  }

  return (
    <TxModalWrapper
      txData={multiSendCallData}
      txTo={getMultisendContractAddress()}
      operation={Operation.DELEGATE}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitText="Update Safe"
    >
      <ModalHeader onClose={onClose} title="Update safe version" />
      <Block className={classes.modalContent}>
        <Row>
          <Paragraph noMargin>
            Update now to take advantage of new features and the highest security standards available.
          </Paragraph>
          <Paragraph>
            To check details about updates added by this smart contract version please visit{' '}
            <Link target="_blank" to={`https://github.com/gnosis/safe-contracts/releases/tag/v${LATEST_SAFE_VERSION}`}>
              latest Boba Multisig contracts changelog
            </Link>
          </Paragraph>
          <Paragraph noMargin>
            You will need to confirm this update just like any other transaction. This means other owners will have to
            confirm the update in case more than one confirmation is required for this Safe.
          </Paragraph>

          {/* A warning for 1.x.x -> 1.3.0 upgrades */}
          <Paragraph>
            <b>Warning</b>: this upgrade will invalidate all unexecuted transactions. This means you will be unable to
            access or execute them after the upgrade. Please make sure to execute any remaining transactions before
            upgrading.
          </Paragraph>
        </Row>
      </Block>
    </TxModalWrapper>
  )
}
