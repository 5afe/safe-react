// 
import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import ReactDOM from 'react-dom'

const useStyles = makeStyles({
  root: {
    zIndex: 1300,
  },
})

const BackdropLayout = ({ isOpen = false }) => {
  if (!isOpen) {
    return null
  }

  const classes = useStyles()

  return ReactDOM.createPortal(<Backdrop classes={{ root: classes.root }} open />, document.body)
}

export default BackdropLayout
