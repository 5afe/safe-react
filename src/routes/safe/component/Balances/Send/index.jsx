// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { lg, md } from '~/theme/variables'

const styles = () => ({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
  },
  manage: {
    fontSize: '24px',
  },
  close: {
    height: '35px',
    width: '35px',
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
}

const Send = ({ classes, onClose }: Props) => (
  <React.Fragment>
    <Row align="center" grow className={classes.heading}>
      <Paragraph className={classes.manage} noMargin>Send Funds</Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.close} />
      </IconButton>
    </Row>
  </React.Fragment>
)

export default withStyles(styles)(Send)
