import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'
import ReactDOM from 'react-dom'

const useStyles = makeStyles({
  root: {
    zIndex: 0,
    top: '52px',
  },
})

const BackdropLayout = ({ isOpen }: { isOpen: boolean }): ReactElement | null => {
  const classes = useStyles()

  return ReactDOM.createPortal(<Backdrop classes={{ root: classes.root }} open={isOpen} />, document.body)
}

export default BackdropLayout
