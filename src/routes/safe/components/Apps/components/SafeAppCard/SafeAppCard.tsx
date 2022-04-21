import { SyntheticEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import IconButton from '@material-ui/core/IconButton'
import { alpha } from '@material-ui/core/styles/colorManipulator'
import { Card, Title, Text, Icon } from '@gnosis.pm/safe-react-components'

import { extractSafeAddress, generateSafeRoute, getShareSafeAppUrl, SAFE_ROUTES } from 'src/routes/routes'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import fallbackSafeAppLogoSvg from 'src/assets/icons/apps.svg'
import { currentChainId } from 'src/logic/config/store/selectors'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import { FETCH_STATUS } from 'src/utils/requests'
import { copyToClipboard } from 'src/utils/clipboard'
import { getShortName } from 'src/config'
import { SafeAppDescriptionSK, SafeAppLogoSK, SafeAppTitleSK } from './SafeAppSkeleton'

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

  const safeAddress = extractSafeAddress()
  const appsPath = generateSafeRoute(SAFE_ROUTES.APPS, {
    shortName: getShortName(),
    safeAddress,
  })
  const openSafeAppLink = `${appsPath}?appUrl=${encodeURI(safeApp.url)}`

  const shareSafeApp = () => {
    const shareSafeAppUrl = getShareSafeAppUrl(safeApp.url, chainId)
    copyToClipboard(shareSafeAppUrl)
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.SHARE_SAFE_APP_URL_COPIED)))
  }

  const isSafeAppLoading = safeApp.fetchStatus === FETCH_STATUS.LOADING

  if (isSafeAppLoading) {
    return (
      <SafeAppContainer size={size} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
    <SafeAppContainer size={size} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
            <SafeAppDescription size="lg">{safeApp.description}</SafeAppDescription>
          </DescriptionContainer>

          {/* Safe App Actions */}
          <ActionsContainer onClick={(e) => e.preventDefault()}>
            {/* Share Safe App button */}
            <IconBtn onClick={shareSafeApp} aria-label={`copy ${safeApp.name} Safe App share link to clipboard`}>
              <Icon size="md" type="share" tooltip="copy share link to clipboard" />
            </IconBtn>

            {/* Pin & Unpin Safe App button */}
            {!isCustomSafeApp && (
              <IconBtn
                onClick={() => togglePin(safeApp)}
                aria-label={`${isPinned ? 'Unpin' : 'Pin'} ${safeApp.name} Safe App`}
              >
                {isPinned ? (
                  <PinnedIcon
                    size="md"
                    type="bookmarkFilled"
                    color="primary"
                    tooltip={`Unpin ${safeApp.name} Safe App`}
                  />
                ) : (
                  <PinnedIcon size="md" type={'bookmark'} tooltip={`Pin ${safeApp.name} Safe App`} />
                )}
              </IconBtn>
            )}

            {/* Remove custom Safe App button */}
            {isCustomSafeApp && (
              <IconBtn onClick={() => onRemove?.(safeApp)} aria-label={`Remove ${safeApp.name} custom Safe App`}>
                <Icon size="md" type="delete" color="error" tooltip={`Remove ${safeApp.name} custom Safe App`} />
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

const SAFE_APP_CARD_HEIGHT = 164

const SafeAppContainer = styled(motion.div)`
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
  padding: 16px;
  display: flex;
  flex-direction: ${(props: { size: SafeAppCardSize }) => (props.size === 'lg' ? 'row' : 'column')};

  :hover {
    box-shadow: 1px 2px 16px 0 ${({ theme }) => alpha(theme.colors.shadow.color, 0.35)};
    transition: box-shadow 0.3s ease-in-out;
    background-color: ${({ theme }) => theme.colors.background};
    cursor: pointer;

    h5 {
      color: ${({ theme }) => theme.colors.primary};
    }
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
  margin: 12px 0px 8px;
  font-size: 14px;
  line-height: initial;
  font-weight: bold;
  color: initial;
`

const SafeAppDescription = styled(Text)`
  margin: 0;
  font-size: 12px;
  line-height: initial;

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