//
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import HomeIcon from 'assets/icons/shape.svg'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import Paragraph from 'components/layout/Paragraph'
import { md, primary, secondaryBackground } from 'theme/variables'

const useStyles = makeStyles({
  container: {
    background: secondaryBackground,
    padding: '5px',
    boxSizing: 'border-box',
    width: '76px',
    justifyContent: 'space-around',
    marginLeft: md,
    color: '#fff',
    borderRadius: '3px',
  },
  defaultText: {
    color: primary,
  },
})

const DefaultBadge = () => {
  const classes = useStyles()

  return (
    <Block className={classes.container} justify="left">
      <Img alt="Home Icon" src={HomeIcon} />
      <Paragraph className={classes.defaultText} noMargin size="xs">
        Default
      </Paragraph>
    </Block>
  )
}

export default DefaultBadge
