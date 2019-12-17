// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Img from '~/components/layout/Img'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { primary, secondaryBackground, md } from '~/theme/variables'
import HomeIcon from '~/assets/icons/shape.svg'

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
    <Block justify="left" className={classes.container}>
      <Img src={HomeIcon} alt="Home Icon" />
      <Paragraph noMargin size="xs" className={classes.defaultText}>
        Default
      </Paragraph>
    </Block>
  )
}

export default DefaultBadge
