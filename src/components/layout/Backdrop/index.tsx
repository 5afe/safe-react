import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'
import ReactDOM from 'react-dom'

const useStyles = makeStyles({
  root: {
    zIndex: 1300,
    top: '52px',
  },
})

const BackdropLayout = (props: { isOpen: boolean }): ReactElement | null => {
  const classes = useStyles()

  if (!props.isOpen) {
    return null
  }

  return ReactDOM.createPortal(<Backdrop classes={{ root: classes.root }} open />, document.body)
}

export default BackdropLayout
