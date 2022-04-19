import { ReactElement, ReactNode } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { Theme } from '@gnosis.pm/safe-react-gateway-sdk'

import ChainIndicator from 'src/components/ChainIndicator'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getChainById, getChainInfo } from 'src/config'
import { styles } from './style'
import styled from 'styled-components'
import { smallFontSize, xs, sm, border, primary } from 'src/theme/variables'

const useStyles = makeStyles(styles)

const ChainIndicatorWrapper = styled(Row)<{ $chainTheme: Theme }>`
  font-size: ${smallFontSize};
  padding: ${xs} ${sm};
  background-color: ${({ $chainTheme }) => $chainTheme.backgroundColor ?? border};
  color: ${({ $chainTheme }) => $chainTheme.textColor ?? primary};
  border-radius: 4px;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 20px;
`

interface HeaderProps {
  onClose: () => unknown
  subTitle?: string
  title: ReactNode
  iconUrl?: string
}

export const ModalHeader = ({ onClose, subTitle, title, iconUrl }: HeaderProps): ReactElement => {
  const classes = useStyles()
  const connectedNetwork = getChainInfo()
  const { theme } = getChainById(connectedNetwork.chainId)

  return (
    <Row align="center" className={classes.heading} grow>
      {iconUrl && <img className={classes.icon} alt={typeof title === 'string' ? title : undefined} src={iconUrl} />}
      <Paragraph className={classes.headingText} noMargin weight="bolder" size="xl">
        {title}
      </Paragraph>
      <Paragraph className={classes.annotation} size="sm">
        {subTitle}
      </Paragraph>
      <ChainIndicatorWrapper $chainTheme={theme}>
        {connectedNetwork.chainId && <ChainIndicator chainId={connectedNetwork.chainId} hideCircle />}
      </ChainIndicatorWrapper>
      <IconButton disableRipple onClick={onClose}>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
  )
}
