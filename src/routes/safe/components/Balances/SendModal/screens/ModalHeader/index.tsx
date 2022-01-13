import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { ReactElement, ReactNode } from 'react'

import ChainIndicator from 'src/components/ChainIndicator'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getChainInfo } from 'src/config'
import { styles } from './style'

const useStyles = makeStyles(styles)

interface HeaderProps {
  onClose: () => unknown
  subTitle?: string
  title: ReactNode
  iconUrl?: string
}

export const ModalHeader = ({ onClose, subTitle, title, iconUrl }: HeaderProps): ReactElement => {
  const classes = useStyles()
  const connectedNetwork = getChainInfo()

  return (
    <Row align="center" className={classes.heading} grow>
      {iconUrl && <img className={classes.icon} alt={typeof title === 'string' ? title : undefined} src={iconUrl} />}
      <Paragraph className={classes.headingText} noMargin weight="bolder">
        {title}
      </Paragraph>
      <Paragraph className={classes.annotation}>{subTitle}</Paragraph>
      <Row className={classes.chainIndicator}>
        {connectedNetwork.chainId && <ChainIndicator chainId={connectedNetwork.chainId} />}
      </Row>
      <IconButton disableRipple onClick={onClose}>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
  )
}
