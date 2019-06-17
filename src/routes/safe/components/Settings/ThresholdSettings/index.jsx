// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Heading from '~/components/layout/Heading'
import Button from '~/components/layout/Button'
import Bold from '~/components/layout/Bold'
import Block from '~/components/layout/Block'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph/index'
import { styles } from './style'

type Props = {
  owners: any,
  threshold: number,
  classes: Object,
}

const ThresholdSettings = ({ owners, threshold, classes }: Props) => (
  <Block className={classes.container}>
    <Heading tag="h3">Required confirmations</Heading>
    <Paragraph>
      Any transaction over any daily limit
      <br />
      {' '}
requires the confirmation of:
    </Paragraph>
    <Paragraph size="xxl" className={classes.ownersText}>
      <Bold>{threshold}</Bold>
      {' '}
out of
      <Bold>{owners.size}</Bold>
      {' '}
owners
    </Paragraph>
    <Row align="center" className={classes.buttonRow}>
      <Button color="primary" minWidth={120} className={classes.modifyBtn} onClick={() => {}} variant="contained">
        Modify
      </Button>
    </Row>
  </Block>
)

export default withStyles(styles)(ThresholdSettings)
