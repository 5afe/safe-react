// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import Hairline from '~/components/layout/Hairline'
import { lg, sm } from '~/theme/variables'

const styles = () => ({
  heading: {
    padding: `${sm} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    maxHeight: '75px',
  },
  manage: {
    fontSize: '24px',
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
  setActiveScreen: Function,
}

const Send = ({ classes, onClose, setActiveScreen }: Props) => (
  <React.Fragment>
    <Row align="center" grow className={classes.heading}>
      <Paragraph className={classes.manage} noMargin>
        Send Funds
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.closeIcon} />
      </IconButton>
    </Row>
    <Hairline />
  </React.Fragment>
)

export default withStyles(styles)(Send)
