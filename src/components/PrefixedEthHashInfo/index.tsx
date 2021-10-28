import { EllipsisMenuItem, EthHashInfo } from '@gnosis.pm/safe-react-components'
import { ThemeColors, ThemeIdenticonSize, ThemeTextSize } from '@gnosis.pm/safe-react-components/dist/theme'
import { useSelector } from 'react-redux'
import { copyShortNameSelector, showShortNameSelector } from 'src/logic/appearance/selectors'
import { extractShortChainName } from 'src/routes/routes'

type ExplorerInfo = () => { url: string; alt: string }

interface Props {
  className?: string
  hash: string
  showHash?: boolean
  shortenHash?: number
  name?: string
  textColor?: ThemeColors
  textSize?: ThemeTextSize
  showAvatar?: boolean
  customAvatar?: string
  customAvatarFallback?: string
  avatarSize?: ThemeIdenticonSize
  showCopyBtn?: boolean
  menuItems?: EllipsisMenuItem[]
  explorerUrl?: ExplorerInfo
}

const PrefixedEthHashInfo: React.FC<Props> = ({ hash, ...rest }) => {
  const showChainPrefix = useSelector(showShortNameSelector)
  const copyChainPrefix = useSelector(copyShortNameSelector)

  return (
    <EthHashInfo
      hash={hash}
      shortName={extractShortChainName()}
      shouldShowShortName={showChainPrefix}
      shouldCopyShortName={copyChainPrefix}
      {...rest}
    />
  )
}

export default PrefixedEthHashInfo
