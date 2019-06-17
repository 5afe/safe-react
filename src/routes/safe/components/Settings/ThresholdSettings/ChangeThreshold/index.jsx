// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Hairline from '~/components/layout/Hairline'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Col from '~/components/layout/Col'
import type { Owner } from '~/routes/safe/store/models/owner'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  threshold: number,
  owners: List<Owner>,
}

const ChangeThreshold = ({ onClose, owners, threshold, classes, }: Props) => (
  <React.Fragment>
    <Row align="center" grow className={classes.heading}>
      <Paragraph className={classes.manage} weight="bolder" noMargin>
        Remove owner
      </Paragraph>
      <IconButton onClick={onClose} disableRipple>
        <Close className={classes.close} />
      </IconButton>
    </Row>
    <Col layout="column" middle="xs" className={classes.detailsContainer}>
      <Hairline />
    </Col>
    <Hairline />
    <Row align="center" className={classes.buttonRow}>
      <Button color="primary" className={classes.button} minWidth={140} onClick={onClose} variant="contained">
        Done
      </Button>
    </Row>
  </React.Fragment>
)

export default withStyles(styles)(ChangeThreshold)
