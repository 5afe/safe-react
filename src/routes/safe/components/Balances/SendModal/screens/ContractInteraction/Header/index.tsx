import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { ReactElement } from 'react'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'

const useStyles = makeStyles(styles)

interface HeaderProps {
  onClose: () => void
  subTitle: string
  title: string
}

export const Header = ({ onClose, subTitle, title }: HeaderProps): ReactElement => {
  const classes = useStyles()

  return (
    <Row align="center" className={classes.heading} grow>
      <Paragraph className={classes.headingText} noMargin weight="bolder">
        {title}
      </Paragraph>
      <Paragraph className={classes.annotation}>{subTitle}</Paragraph>
      <IconButton disableRipple onClick={onClose}>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
  )
}
