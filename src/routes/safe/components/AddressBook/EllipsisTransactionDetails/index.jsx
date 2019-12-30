// @flow
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Divider } from '@material-ui/core'
import { xs } from '~/theme/variables'

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

type EllipsisTransactionDetailsProps = {
  knownAddress: boolean,

}

const EllipsisTransactionDetails = ({ knownAddress }: EllipsisTransactionDetailsProps) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const closeMenuHandler = () => setAnchorEl(null)
  const editEntryHandler = () => {
    closeMenuHandler()
  }

  const addEntryHandler = () => {
    closeMenuHandler()
  }


  return (
    <ClickAwayListener onClickAway={closeMenuHandler}>
      <div className={classes.container} onClick={handleClick}>
        <MoreHorizIcon />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={closeMenuHandler}
        >
          <MenuItem onClick={closeMenuHandler}>Send Again</MenuItem>
          <Divider />
          { knownAddress ? <MenuItem onClick={editEntryHandler}>Edit Entry</MenuItem> : <MenuItem onClick={addEntryHandler}>Add Entry</MenuItem>}
        </Menu>
      </div>
    </ClickAwayListener>
  )
}

export default EllipsisTransactionDetails
