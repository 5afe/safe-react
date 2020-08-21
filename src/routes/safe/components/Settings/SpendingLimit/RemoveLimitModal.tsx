import { Button, Icon, Title } from '@gnosis.pm/safe-react-components'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Modal from 'src/components/Modal'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { Token } from 'src/logic/tokens/store/model/token'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import SpendingLimitModule from 'src/utils/AllowanceModule.json'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'

import { FooterSection, FooterWrapper, StyledButton, TitleSection } from '.'
import { SpendingLimitTable } from './dataFetcher'
import { AddressInfo, TokenInfo, ResetTimeInfo } from './InfoDisplay'
import { RESET_TIME_OPTIONS } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { useStyles } from './style'
import { fromTokenUnit } from './utils'

interface RemoveSpendingLimitModalProps {
  onClose: () => void
  spendingLimit: SpendingLimitTable
  open: boolean
}

const RemoveLimitModal = ({ onClose, spendingLimit, open }: RemoveSpendingLimitModalProps): React.ReactElement => {
  const classes = useStyles()

  const tokens = useSelector(extendedSafeTokensSelector)
  const [tokenInfo, setTokenInfo] = React.useState<Token>()
  React.useEffect(() => {
    if (tokens) {
      const tokenAddress =
        spendingLimit.spent.tokenAddress === ZERO_ADDRESS ? ETH_ADDRESS : spendingLimit.spent.tokenAddress
      const foundToken = tokens.find((token) => token.address === tokenAddress)
      setTokenInfo(foundToken)
    }
  }, [spendingLimit.spent.tokenAddress, tokens])

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
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
        .setAllowance(beneficiary, tokenAddress === ETH_ADDRESS ? ZERO_ADDRESS : tokenAddress, 0, 0, 0)
        .encodeABI()

      dispatch(
        createTransaction({
          safeAddress,
          to: SPENDING_LIMIT_MODULE_ADDRESS,
          valueInWei: '0',
          txData,
          notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
          enqueueSnackbar,
          closeSnackbar,
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
      description="Remove the selected Spending Limit"
      handleClose={onClose}
      paperClassName={classes.modal}
      title="Remove Spending Limit"
      open={open}
    >
      <TitleSection>
        <Title size="xs" withoutMargin>
          Remove Spending Limit
        </Title>

        <StyledButton onClick={onClose}>
          <Icon size="sm" type="cross" />
        </StyledButton>
      </TitleSection>

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

      <FooterSection>
        <FooterWrapper>
          <Button size="md" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="error" size="md" variant="contained" onClick={removeSelectedSpendingLimit}>
            Remove
          </Button>
        </FooterWrapper>
      </FooterSection>
    </Modal>
  )
}

export default RemoveLimitModal
