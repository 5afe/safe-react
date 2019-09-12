// @flow
import React, { useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
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

const CopyBtn = ({ content, classes }: CopyBtnProps) => {
  if (!navigator.clipboard) {
    return null
  }

  const [clicked, setClicked] = useState<boolean>(false)

  return (
    <Tooltip
      title={clicked ? 'Copied' : 'Copy to clipboard'}
      placement="top"
      onClose={() => {
        // this is fired before tooltip is closed
        // added setTimeout so the user doesn't see the text changing/jumping
        setTimeout(() => {
          if (clicked) {
            setClicked(false)
          }
        }, 300)
      }}
    >
      <div className={classes.container}>
        <Img
          src={CopyIcon}
          height={20}
          alt="Copy to clipboard"
          onClick={() => {
            copyToClipboard(content)
            setClicked(true)
          }}
        />
      </div>
    </Tooltip>
  )
}

export default withStyles(styles)(CopyBtn)
