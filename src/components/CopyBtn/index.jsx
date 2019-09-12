// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Img from '~/components/layout/Img'
import { copyToClipboard } from '~/utils/clipboard'
import { xs } from '~/theme/variables'
import CopyIcon from './copy.svg'

const styles = () => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    padding: xs,
    borderRadius: '50%',
    transition: 'background-color .2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F0EFEE',
    },
  },
})

type CopyBtnProps = {
  content: string,
  classes: Object,
}

const CopyBtn = ({ content, classes }: CopyBtnProps) => (navigator.clipboard ? (
  <div className={classes.container} title="Copy to clipboard">
    <Img src={CopyIcon} height={20} alt="Copy to clipboard" onClick={() => copyToClipboard(content)} />
  </div>
) : null)

export default withStyles(styles)(CopyBtn)
