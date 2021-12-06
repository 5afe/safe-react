import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { ReactElement } from 'react'

import ChainIndicator from 'src/components/ChainIndicator'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getChainInfo } from 'src/config'
import { styles } from './style'

const useStyles = makeStyles(styles)

interface HeaderProps {
  onClose: () => void
  subTitle?: string
  title: string
  iconUrl?: string
}

export const ModalHeader = ({ onClose, subTitle, title, iconUrl }: HeaderProps): ReactElement => {
  const classes = useStyles()
  const connectedNetwork = getChainInfo()

  return (
    <Row align="center" className={classes.heading} grow>
      {iconUrl && <img className={classes.icon} alt={title} src={iconUrl} />}
      <Paragraph className={classes.headingText} noMargin weight="bolder">
        {title}
      </Paragraph>
      <Paragraph className={classes.annotation}>{subTitle ? subTitle : ''}</Paragraph>
      <Row className={classes.chainIndicator}>
        {connectedNetwork.chainId && <ChainIndicator chainId={connectedNetwork.chainId} />}
      </Row>
      <IconButton disableRipple onClick={onClose}>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
  )
}
