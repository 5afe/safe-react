import { SyntheticEvent } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Bookmark from '@material-ui/icons/Bookmark'
import BookmarkBorder from '@material-ui/icons/BookmarkBorder'
import { alpha } from '@material-ui/core/styles/colorManipulator'
import IconButton from '@material-ui/core/IconButton'
import { Title, Text, Button, Card, Icon } from '@gnosis.pm/safe-react-components'
import { motion } from 'framer-motion'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
import { FETCH_STATUS } from 'src/utils/requests'
import { SafeApp } from '../../types'

import appsIconSvg from 'src/assets/icons/apps.svg'
import { AppIconSK, DescriptionSK, TitleSK } from './skeleton'

const StyledAppCard = styled(Card)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  box-shadow: 1px 2px 10px 0 ${({ theme }) => alpha(theme.colors.shadow.color, 0.18)};
  height: 232px !important;
  box-sizing: border-box;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};

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

const IconBtn = styled(IconButton)`
  &.MuiButtonBase-root {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    padding: 5px;
    opacity: 0;

    transition: opacity 0.2s ease-in-out;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const AppContainer = styled(motion.div)`
  position: relative;

  &:hover {
    ${IconBtn} {
      opacity: 1;
    }
  }
`

const IconImg = styled.img<{ size: 'md' | 'lg'; src: string | undefined }>`
  width: ${({ size }) => (size === 'md' ? '60px' : '102px')};
  height: ${({ size }) => (size === 'md' ? '60px' : '92px')};
  margin-top: ${({ size }) => (size === 'md' ? '0' : '-16px')};
  object-fit: contain;
`

const AppName = styled(Title)`
  text-align: center;
  margin: 16px 0 9px 0;
`

const AppDescription = styled(Text)`
  text-align: center;
  height: 72px;
  line-height: 24px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const setAppImageFallback = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
  error.currentTarget.onerror = null
  error.currentTarget.src = appsIconSvg
}

const isAppLoading = (app: SafeApp) => FETCH_STATUS.LOADING === app.fetchStatus
const getPinLabel = (name: string, pinned: boolean) => (pinned ? `Unpin ${name}` : `Pin ${name}`)

type Shared = {
  className?: string
  app: SafeApp
  iconSize?: 'md' | 'lg'
  to: string
  pinned?: boolean
}

type CustomAppProps = Shared & { onRemove?: (app: SafeApp) => void; onPin?: undefined }
type RemoteAppProps = Shared & { onPin?: (app: SafeApp) => void; onRemove?: undefined }
type Props = CustomAppProps | RemoteAppProps

const AppCard = ({ app, iconSize = 'md', to, onPin, onRemove, pinned = false }: Props): React.ReactElement => {
  if (isAppLoading(app)) {
    return (
      <AppContainer layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <StyledAppCard>
          <AppIconSK />
          <TitleSK />
          <DescriptionSK />
          <DescriptionSK />
        </StyledAppCard>
      </AppContainer>
    )
  }

  const content = (
    <>
      <StyledAppCard>
        <IconImg alt={`${app.name || 'App'} Logo`} src={app.iconUrl} onError={setAppImageFallback} size={iconSize} />
        <AppName size="xs">{app.name}</AppName>
        <AppDescription size="lg">{app.description} </AppDescription>
      </StyledAppCard>
      {onPin && (
        <IconBtn
          aria-label={getPinLabel(app.name, pinned)}
          title={getPinLabel(app.name, pinned)}
          onClick={(e) => {
            // prevent triggering the link event
            e.preventDefault()

            onPin(app)
          }}
        >
          {pinned ? <Bookmark /> : <BookmarkBorder />}
        </IconBtn>
      )}

      {onRemove && (
        <IconBtn
          aria-label="Remove an app"
          title="Remove app"
          onClick={(e) => {
            e.preventDefault()

            onRemove(app)
          }}
        >
          <Icon size="sm" type="delete" color="error" />
        </IconBtn>
      )}
    </>
  )

  return (
    <AppContainer layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <StyledLink to={to}>{content}</StyledLink>
    </AppContainer>
  )
}

const AddCustomAppCard = ({ onClick }: { onClick: () => void }): React.ReactElement => (
  <AppContainer layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClick}>
    <StyledAppCard>
      <IconImg alt="PlayStation gamepad symbols" src={AddAppIcon} onError={setAppImageFallback} size="lg" />
      <Button size="md" color="primary" variant="contained" onClick={onClick}>
        Add custom app
      </Button>
    </StyledAppCard>
  </AppContainer>
)

export { AppCard, AddCustomAppCard }
