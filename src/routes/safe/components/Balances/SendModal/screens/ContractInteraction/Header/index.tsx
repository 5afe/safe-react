import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { styles } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/style'

const useStyles = makeStyles(styles as any)

const Header = ({ onClose, subTitle, title }) => {
  const classes = useStyles()

  return (
    <Row align="center" className={classes.heading} grow>
      <Paragraph className={classes.manage} noMargin weight="bolder">
        {title}
      </Paragraph>
      <Paragraph className={classes.annotation}>{subTitle}</Paragraph>
      <IconButton disableRipple onClick={onClose}>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
  )
}

export default Header
