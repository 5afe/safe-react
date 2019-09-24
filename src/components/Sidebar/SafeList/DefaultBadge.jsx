// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Img from '~/components/layout/Img'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import { primary, sm } from '~/theme/variables'
import StarIcon from './assets/star.svg'

const useStyles = makeStyles({
  container: {
    background: primary,
    padding: '5px',
    boxSizing: 'border-box',
    width: '73px',
    justifyContent: 'space-around',
    marginLeft: sm,
    color: '#fff',
    borderRadius: '3px',
  },
})

const DefaultBadge = () => {
  const classes = useStyles()

  return (
    <Block align="left" className={classes.container}>
      <Img src={StarIcon} alt="Star Icon" />
      <Paragraph noMargin size="xs">
        default
      </Paragraph>
    </Block>
  )
}

export default DefaultBadge
