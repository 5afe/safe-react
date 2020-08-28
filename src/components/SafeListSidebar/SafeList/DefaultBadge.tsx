import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import HomeIcon from 'src/assets/icons/shape.svg'
import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { md, primary, secondaryBackground } from 'src/theme/variables'

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

const DefaultBadge = (): React.ReactElement => {
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
