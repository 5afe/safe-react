// @flow
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { styles } from './style'

class AddCustomToken extends Component {
  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Block>
          <Paragraph noMargin className={classes.title} size="lg">
            Add custom token
          </Paragraph>
        </Block>
      </React.Fragment>
    )
  }
}

const AddCustomTokenComponent = withStyles(styles)(AddCustomToken)

export default AddCustomTokenComponent
