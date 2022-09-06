import { Box, ButtonBase } from '@material-ui/core'
import { Text, Tooltip } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'
import Img from 'src/components/layout/Img'
import { getShortName, _getChainId } from 'src/config'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { background } from 'src/theme/variables'
import { SAFE_TOKEN_ADDRESSES } from 'src/utils/constants'
import SafeTokenIcon from './safe_token.svg'
import styled from 'styled-components'
import Track from 'src/components/Track'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'

// TODO: once listed on safe apps list, get the url from there?
const CLAIMING_APP_URL = 'https://safe-claiming-app.pages.dev/'

export const getSafeTokenAddress = (chainId: string): string => {
  return SAFE_TOKEN_ADDRESSES[chainId]
}

const StyledWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: center;
`

const buttonStyle = {
  alignSelf: 'stretch',
  display: 'flex',
  borderRadius: '8px',
  padding: '0px 8px 0px 8px',
  backgroundColor: background,
  margin: '8px 16px',
  height: '30px',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
}

const SafeTokenWidget = (): JSX.Element | null => {
  const safeTokens = useSelector(extendedSafeTokensSelector)

  const chainId = _getChainId()

  const { safeAddress } = useSafeAddress()
  if (!safeAddress) {
    return null
  }

  const appsPath = generateSafeRoute(SAFE_ROUTES.APPS, {
    shortName: getShortName(),
    safeAddress,
  })

  const tokenAddress = getSafeTokenAddress(chainId)
  if (!tokenAddress) {
    return null
  }

  const url = `${appsPath}?appUrl=${encodeURI(CLAIMING_APP_URL)}`

  const safeBalance = safeTokens.find((balanceItem) => {
    return balanceItem.address === tokenAddress
  })

  const safeBalanceDecimals = Number(safeBalance?.balance?.tokenBalance || 0)
  const flooredSafeBalance = formatAmount(safeBalanceDecimals.toFixed(2))

  return (
    <StyledWrapper>
      <Tooltip title="Open $SAFE Claiming App">
        <Track {...OVERVIEW_EVENTS.SAFE_TOKEN_WIDGET}>
          <ButtonBase href={url} aria-describedby={'safe-token-widget'} style={buttonStyle}>
            <Img alt="Safe token" src={SafeTokenIcon} />
            <Text size="xl" strong>
              {flooredSafeBalance}
            </Text>
          </ButtonBase>
        </Track>
      </Tooltip>
    </StyledWrapper>
  )
}

export default SafeTokenWidget
