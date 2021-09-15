import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { ReactElement } from 'react'
import ChainIndicator from 'src/components/ChainIndicator'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getNetworkInfo } from 'src/config'
import { styles } from './style'

const useStyles = makeStyles(styles)

interface HeaderProps {
  onClose: () => void
  subTitle: string
  title: string
}

export const ModalHeader = ({ onClose, subTitle, title }: HeaderProps): ReactElement => {
  const classes = useStyles()
  const connectedNetwork = getNetworkInfo()

  return (
    <Row align="center" className={classes.heading} grow>
      <Paragraph className={classes.headingText} noMargin weight="bolder">
        {title}
      </Paragraph>
      <Paragraph className={classes.annotation}>{subTitle}</Paragraph>
      <Row className={classes.chainIndicator}>
        {connectedNetwork.id && <ChainIndicator chainId={connectedNetwork.id} />}
      </Row>
      <IconButton disableRipple onClick={onClose}>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
  )
}
