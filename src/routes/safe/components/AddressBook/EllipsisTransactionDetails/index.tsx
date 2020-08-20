import { ClickAwayListener, Divider } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { push } from 'connected-react-router'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { xs } from 'src/theme/variables'

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
    outline: 'none',
  },
  increasedPopperZindex: {
    zIndex: 2001,
  },
})

const EllipsisTransactionDetails = ({ address, knownAddress }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const dispatch = useDispatch()
  const currentSafeAddress = useSelector(safeParamAddressFromStateSelector)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const closeMenuHandler = () => setAnchorEl(null)

  const addOrEditEntryHandler = () => {
    dispatch(push(`${SAFELIST_ADDRESS}/${currentSafeAddress}/address-book?entryAddress=${address}`))
    closeMenuHandler()
  }

  return (
    <ClickAwayListener onClickAway={closeMenuHandler}>
      <div className={classes.container} role="menu" tabIndex={0}>
        <MoreHorizIcon onClick={handleClick} onKeyDown={handleClick} />
        <Menu anchorEl={anchorEl} id="simple-menu" keepMounted onClose={closeMenuHandler} open={Boolean(anchorEl)}>
          <MenuItem disabled onClick={closeMenuHandler}>
            Send Again
          </MenuItem>
          <Divider />
          {knownAddress ? (
            <MenuItem onClick={addOrEditEntryHandler}>Edit Address book Entry</MenuItem>
          ) : (
            <MenuItem onClick={addOrEditEntryHandler}>Add to address book</MenuItem>
          )}
        </Menu>
      </div>
    </ClickAwayListener>
  )
}

export default EllipsisTransactionDetails
