import { SyntheticEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import IconButton from '@material-ui/core/IconButton'
import { Card, Title, Text, Icon } from '@gnosis.pm/safe-react-components'

import { generateSafeRoute, getShareSafeAppUrl, SAFE_ROUTES } from 'src/routes/routes'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import fallbackSafeAppLogoSvg from 'src/assets/icons/apps.svg'
import { currentChainId } from 'src/logic/config/store/selectors'
import { showNotification } from 'src/logic/notifications/store/notifications'
import { NOTIFICATIONS } from 'src/logic/notifications'
import { FETCH_STATUS } from 'src/utils/requests'
import { copyToClipboard } from 'src/utils/clipboard'
import { getShortName } from 'src/config'
import { SafeAppDescriptionSK, SafeAppLogoSK, SafeAppTitleSK } from './SafeAppSkeleton'
import { primary200, primary300 } from 'src/theme/variables'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

type SafeAppCardSize = 'md' | 'lg'

type SafeAppCardProps = {
  safeApp: SafeApp
  size: SafeAppCardSize
  togglePin: (app: SafeApp) => void
  isPinned?: boolean
  isCustomSafeApp?: boolean
  onRemove?: (app: SafeApp) => void
}

const SafeAppCard = ({
  safeApp,
  size,
  togglePin,
  isPinned,
  isCustomSafeApp,
  onRemove,
}: SafeAppCardProps): React.ReactElement => {
  const chainId = useSelector(currentChainId)
  const dispatch = useDispatch()

  const { safeAddress } = useSafeAddress()
  const appsPath = generateSafeRoute(SAFE_ROUTES.APPS, {
    shortName: getShortName(),
    safeAddress,
  })
  const openSafeAppLink = `${appsPath}?appUrl=${encodeURI(safeApp.url)}`

  const shareSafeApp = () => {
    const shareSafeAppUrl = getShareSafeAppUrl(safeApp.url, chainId)
    copyToClipboard(shareSafeAppUrl)
    dispatch(showNotification(NOTIFICATIONS.SHARE_SAFE_APP_URL_COPIED))
  }

  const isSafeAppLoading = safeApp.fetchStatus === FETCH_STATUS.LOADING

  if (isSafeAppLoading) {
    return (
      <SafeAppContainer size={size}>
        <StyledAppCard size={size}>
          <LogoContainer size={size}>
            <SafeAppLogoSK size={size} />
          </LogoContainer>
          <DescriptionContainer size={size}>
            <SafeAppTitleSK />
            <SafeAppDescriptionSK />
            <SafeAppDescriptionSK />
          </DescriptionContainer>
        </StyledAppCard>
      </SafeAppContainer>
    )
  }

  return (
    <SafeAppContainer size={size}>
      <StyledLink to={openSafeAppLink} aria-label={`open ${safeApp.name} Safe App`}>
        <StyledAppCard size={size}>
          {/* Safe App Logo */}
          <LogoContainer size={size}>
            <SafeAppLogo
              size={size}
              src={safeApp.iconUrl}
              alt={`${safeApp.name || 'Safe App'} Logo`}
              onError={setSafeAppLogoFallback}
            />
          </LogoContainer>

          {/* Safe App Description */}
          <DescriptionContainer size={size}>
            <SafeAppTitle size="xs">{safeApp.name}</SafeAppTitle>
            <SafeAppDescription size="lg" color="inputFilled">
              {safeApp.description}
            </SafeAppDescription>
          </DescriptionContainer>

          {/* Safe App Actions */}
          <ActionsContainer onClick={(e) => e.preventDefault()}>
            {/* Share Safe App button */}
            <IconBtn onClick={shareSafeApp} aria-label={`copy ${safeApp.name} Safe App share link to clipboard`}>
              <Icon size="md" type="share" tooltip="Copy share link" />
            </IconBtn>

            {/* Pin & Unpin Safe App button */}
            {!isCustomSafeApp && (
              <IconBtn
                onClick={() => togglePin(safeApp)}
                aria-label={`${isPinned ? 'Unpin' : 'Pin'} ${safeApp.name} Safe App`}
              >
                {isPinned ? (
                  <PinnedIcon size="md" type="bookmarkFilled" color="primary" tooltip="Unpin from the Safe Apps" />
                ) : (
                  <PinnedIcon size="md" type="bookmark" tooltip="Pin from the Safe Apps" />
                )}
              </IconBtn>
            )}

            {/* Remove custom Safe App button */}
            {isCustomSafeApp && (
              <IconBtn onClick={() => onRemove?.(safeApp)} aria-label={`Remove ${safeApp.name} custom Safe App`}>
                <Icon size="md" type="delete" color="error" tooltip="Remove Custom Safe App" />
              </IconBtn>
            )}
          </ActionsContainer>
        </StyledAppCard>
      </StyledLink>
    </SafeAppContainer>
  )
}

export default SafeAppCard

const setSafeAppLogoFallback = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
  error.currentTarget.onerror = null
  error.currentTarget.src = fallbackSafeAppLogoSvg
}

export const SAFE_APP_CARD_HEIGHT = 190
export const SAFE_APP_CARD_PADDING = 16

const SafeAppContainer = styled(motion.div).attrs({
  layout: true,
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
})`
  position: relative;
  display: flex;
  height: ${SAFE_APP_CARD_HEIGHT}px;

  grid-column: span ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? '2' : '1')};
`

const StyledLink = styled(Link)`
  display: flex;
  flex: 1 0;
  height: ${SAFE_APP_CARD_HEIGHT}px;
  text-decoration: none;
`

const StyledAppCard = styled(Card)`
  flex: 1 1 100%;
  padding: ${SAFE_APP_CARD_PADDING}px;
  display: flex;
  flex-direction: ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? 'row' : 'column')};
  box-shadow: none;
  border: 2px solid transparent;

  transition: all 0.3s ease-in-out 0s;
  transition-property: border-color, background-color;

  :hover {
    background-color: ${primary200};
    border: 2px solid ${primary300};
  }
`

const LogoContainer = styled.div`
  flex: 0 0;
  flex-basis: ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? '50%' : 'auto')};

  display: flex;
  justify-content: ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? 'center' : 'start')};
  align-items: center;
`

const SafeAppLogo = styled.img`
  height: ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? '112px' : '50px')};
  width: ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? '112px' : '50px')};
  object-fit: contain;
`

const DescriptionContainer = styled.div`
  flex: 0 0;

  flex-basis: ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? '50%' : 'auto')};

  display: flex;
  flex-direction: column;
  justify-content: center;
`

const SafeAppTitle = styled(Title)`
  margin: 8px 0px;
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
  color: initial;
`

const SafeAppDescription = styled(Text)`
  margin: 0;
  line-height: 22px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

const ActionsContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;

  margin: 16px 12px;
`

const IconBtn = styled(IconButton)`
  padding: 8px;

  && svg {
    width: 16px;
    height: 16px;
  }
`
const PinnedIcon = styled(Icon)`
  padding-left: 2px;
`
