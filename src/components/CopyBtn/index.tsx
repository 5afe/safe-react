import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState } from 'react'

import CopyIcon from './copy.svg'

import Img from 'src/components/layout/Img'
import { xs } from 'src/theme/variables'
import { copyToClipboard } from 'src/utils/clipboard'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    margin: `0 ${xs}`,
    borderRadius: '50%',
    transition: 'background-color .2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F0EFEE',
    },
  },
  increasedPopperZindex: {
    zIndex: 2001,
  },
})

const CopyBtn = ({ className = '', content, increaseZindex = false }) => {
  const [clicked, setClicked] = useState(false)
  const classes = useStyles()
  const customClasses = increaseZindex ? { popper: classes.increasedPopperZindex } : {}

  return (
    <Tooltip
      classes={customClasses}
      onClose={() => {
        // this is fired before tooltip is closed
        // added setTimeout so the user doesn't see the text changing/jumping
        setTimeout(() => {
          if (clicked) {
            setClicked(false)
          }
        }, 300)
      }}
      placement="top"
      title={clicked ? 'Copied' : 'Copy to clipboard'}
    >
      <div className={cn(classes.container, className)}>
        <Img
          alt="Copy to clipboard"
          height={20}
          onClick={() => {
            copyToClipboard(content)
            setClicked(true)
          }}
          src={CopyIcon}
        />
      </div>
    </Tooltip>
  )
}

export default CopyBtn
