import { Button } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import { getNetworkInfo } from 'src/config'
import SpendingLimitModule from 'src/logic/contracts/artifacts/AllowanceModule.json'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import useToken from 'src/routes/safe/components/Settings/SpendingLimit/hooks/useToken'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

import { RESET_TIME_OPTIONS } from './FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from './InfoDisplay'
import { SpendingLimitTable } from './LimitsTable/dataFetcher'
import Modal from './Modal'
import { useStyles } from './style'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'

const { nativeCoin } = getNetworkInfo()

interface RemoveSpendingLimitModalProps {
  onClose: () => void
  spendingLimit: SpendingLimitTable
  open: boolean
}

const RemoveLimitModal = ({ onClose, spendingLimit, open }: RemoveSpendingLimitModalProps): React.ReactElement => {
  const classes = useStyles()

  const tokenInfo = useToken(spendingLimit.spent.tokenAddress)

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const dispatch = useDispatch()

  const removeSelectedSpendingLimit = async (): Promise<void> => {
    try {
      const web3 = getWeb3()
      const spendingLimitContract = new web3.eth.Contract(SpendingLimitModule.abi as any, SPENDING_LIMIT_MODULE_ADDRESS)
      const {
        beneficiary,
        spent: { tokenAddress },
      } = spendingLimit

      // TODO: replace with a proper way to remove allowances.
      //  as we don't have a current way to remove an allowance, we tweak it by setting its `amount` and `resetTimeMin` to 0
      //  This is directly related to `discardZeroAllowance`
      const txData = spendingLimitContract.methods
        .setAllowance(beneficiary, tokenAddress === nativeCoin.address ? ZERO_ADDRESS : tokenAddress, 0, 0, 0)
        .encodeABI()

      dispatch(
        createTransaction({
          safeAddress,
          to: SPENDING_LIMIT_MODULE_ADDRESS,
          valueInWei: '0',
          txData,
          notifiedTransaction: TX_NOTIFICATION_TYPES.REMOVE_SPENDING_LIMIT_TX,
        }),
      )
    } catch (e) {
      console.error(
        `failed to remove spending limit ${spendingLimit.beneficiary} -> ${spendingLimit.spent.tokenAddress}`,
        e.message,
      )
    }
  }

  const resetTimeLabel =
    RESET_TIME_OPTIONS.find(({ value }) => +value === +spendingLimit.resetTime.resetTimeMin / 24 / 60)?.label ?? ''

  return (
    <Modal
      handleClose={onClose}
      open={open}
      title="Remove Spending Limit"
      description="Remove the selected Spending Limit"
    >
      <Modal.TopBar title="Remove Spending Limit" onClose={onClose} />

      <Block className={classes.container}>
        <Col margin="lg">
          <AddressInfo title="Beneficiary" address={spendingLimit.beneficiary} />
        </Col>
        <Col margin="lg">
          {tokenInfo && (
            <TokenInfo
              amount={fromTokenUnit(spendingLimit.spent.amount, tokenInfo.decimals)}
              title="Amount"
              token={tokenInfo}
            />
          )}
        </Col>
        <Col margin="lg">
          <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
        </Col>
      </Block>

      <Modal.Footer>
        <Button size="md" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="error" size="md" variant="contained" onClick={removeSelectedSpendingLimit}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveLimitModal
