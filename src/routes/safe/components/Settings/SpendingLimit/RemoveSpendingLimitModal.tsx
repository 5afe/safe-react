import { Button, EthHashInfo, Icon, IconText, Text, Title } from '@gnosis.pm/safe-react-components'
import { Skeleton } from '@material-ui/lab'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fromTokenUnit } from 'src/routes/safe/components/Settings/SpendingLimit/utils'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import Modal from 'src/components/Modal'
import { getNetwork } from 'src/config'
import { getAddressBook } from 'src/logic/addressBook/store/selectors'
import { getNameFromAdbk } from 'src/logic/addressBook/utils'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { Token } from 'src/logic/tokens/store/model/token'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import {
  FooterSection,
  FooterWrapper,
  StyledButton,
  TitleSection,
} from 'src/routes/safe/components/Settings/SpendingLimit'
import { RESET_TIME_OPTIONS } from 'src/routes/safe/components/Settings/SpendingLimit/ResetTime'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import SpendingLimitModule from 'src/utils/AllowanceModule.json'
import { SPENDING_LIMIT_MODULE_ADDRESS } from 'src/utils/constants'
import { ResetTimeInfo as ResetTimeInfoType, SpendingLimitTable } from './dataFetcher'

import { useStyles } from './style'

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin: 0 8px 0 0;
`

const StyledImageName = styled.div`
  display: flex;
  align-items: center;
`

interface GenericInfoProps {
  title?: string
  children: React.ReactNode
}

const GenericInfo = ({ title, children }: GenericInfoProps): React.ReactElement => (
  <>
    {title && (
      <Text size="lg" color="secondaryLight">
        {title}
      </Text>
    )}
    {children ?? <Skeleton animation="wave" variant="rect" />}
  </>
)

interface AddressInfoProps {
  title?: string
  address: string
}

const AddressInfo = ({ title, address }: AddressInfoProps): React.ReactElement => {
  const addressBook = useSelector(getAddressBook)

  return (
    <GenericInfo title={title}>
      {addressBook && (
        <EthHashInfo
          hash={address}
          name={addressBook ? getNameFromAdbk(addressBook, address) : ''}
          showCopyBtn
          showEtherscanBtn
          showIdenticon
          textSize="lg"
          network={getNetwork()}
        />
      )}
    </GenericInfo>
  )
}

interface TokenInfoProps {
  title?: string
  amount: string
  address: string
}

const TokenInfo = ({ title, amount, address }: TokenInfoProps): React.ReactElement => {
  const tokens = useSelector(extendedSafeTokensSelector)
  const [token, setToken] = React.useState<Token | null>()

  React.useEffect(() => {
    if (tokens) {
      const tokenAddress = address === ZERO_ADDRESS ? ETH_ADDRESS : address
      const foundToken = tokens.find((token) => token.address === tokenAddress)
      setToken(foundToken ?? null)
    }
  }, [address, tokens])

  return (
    <GenericInfo title={title}>
      {token && (
        <StyledImageName>
          <StyledImage alt={token.name} onError={setImageToPlaceholder} src={token.logoUri} />
          <Text size="lg">
            {fromTokenUnit(amount, token.decimals)} {token.symbol}
          </Text>
        </StyledImageName>
      )}
      {token === null && <Text size="lg">No token info</Text>}
    </GenericInfo>
  )
}

interface ResetTimeInfoProps {
  title?: string
  resetTime: ResetTimeInfoType
}

const ResetTimeInfo = ({ title, resetTime }: ResetTimeInfoProps): React.ReactElement => {
  return (
    <GenericInfo title={title}>
      {resetTime.resetTimeMin !== '0' ? (
        <Row align="center" margin="md">
          <IconText
            iconSize="md"
            iconType="fuelIndicator"
            text={RESET_TIME_OPTIONS.find(({ value }) => +value === +resetTime.resetTimeMin / 24 / 60).label}
            textSize="lg"
          />
        </Row>
      ) : (
        <Row align="center" margin="md">
          <Text size="lg">One-time spending limit allowance</Text>
        </Row>
      )}
    </GenericInfo>
  )
}

interface RemoveSpendingLimitModalProps {
  onClose: () => void
  spendingLimit: SpendingLimitTable
  open: boolean
}

const RemoveSpendingLimitModal = ({
  onClose,
  spendingLimit,
  open,
}: RemoveSpendingLimitModalProps): React.ReactElement => {
  const classes = useStyles()

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
          <TokenInfo title="Amount" amount={spendingLimit.spent.amount} address={spendingLimit.spent.tokenAddress} />
        </Col>
        <Col margin="lg">
          <ResetTimeInfo title="Reset Time" resetTime={spendingLimit.resetTime} />
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

export default RemoveSpendingLimitModal
