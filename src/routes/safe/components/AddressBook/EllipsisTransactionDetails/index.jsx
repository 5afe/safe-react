// @flow
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Divider } from '@material-ui/core'
import { push } from 'connected-react-router'
import { xs } from '~/theme/variables'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'
import { SAFELIST_ADDRESS } from '~/routes/routes'

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
  address: string,
}

const EllipsisTransactionDetails = ({ knownAddress, address }: EllipsisTransactionDetailsProps) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const dispatch = useDispatch()
  const currentSafeAddress = useSelector(safeParamAddressFromStateSelector)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenuHandler = () => setAnchorEl(null)

  const addOrEditEntryHandler = () => {
    dispatch(push(`${SAFELIST_ADDRESS}/${currentSafeAddress}/address-book?entryAddress=${address}`))
    closeMenuHandler()
  }

  return (
    <ClickAwayListener onClickAway={closeMenuHandler}>
      <div role="menu" tabIndex={0} className={classes.container} onClick={handleClick} onKeyDown={handleClick}>
        <MoreHorizIcon />
        <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenuHandler}>
          <MenuItem onClick={closeMenuHandler} disabled>
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
