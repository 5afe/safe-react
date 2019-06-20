// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import { sm, boldFont } from '~/theme/variables'
import { styles } from './style'

const controlsStyle = {
  backgroundColor: 'white',
  padding: sm,
}

const saveButtonStyle = {
  marginRight: sm,
  fontWeight: boldFont,
}

type Props = {
  classes: Object,
}

class UpdateSafeName extends React.Component<Props, State> {
  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Block margin="lg">
          <Paragraph size="lg" color="primary" noMargin>
            Details
          </Paragraph>
        </Block>
        <Row style={controlsStyle} align="end" grow>
          <Col end="xs">
            <Button
              type="submit"
              style={saveButtonStyle}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {}}
            >
              SAVE
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(UpdateSafeName)
