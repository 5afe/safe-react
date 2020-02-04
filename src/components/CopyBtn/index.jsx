// @flow
import React, { useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import Img from '~/components/layout/Img'
import { copyToClipboard } from '~/utils/clipboard'
import { xs } from '~/theme/variables'
import CopyIcon from './copy.svg'

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

type CopyBtnProps = {
  className?: any,
  content: string,
  increaseZindex?: boolean,
}

const CopyBtn = ({ className, content, increaseZindex = false }: CopyBtnProps) => {
  const [clicked, setClicked] = useState<boolean>(false)
  const classes = useStyles()
  const customClasses = increaseZindex ? { popper: classes.increasedPopperZindex } : {}

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
      classes={customClasses}
    >
      <div className={cn(classes.container, className)}>
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

export default CopyBtn
