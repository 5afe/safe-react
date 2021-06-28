import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
    padding: '5px 0',
    opacity: '0.3',
    transition: 'opacity 200ms ease-in',

    '&:hover': {
      opacity: '1',
    },
  },
})

type Props = {
  address: string
}

export const UnsavedAddress = ({ address }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <EthHashInfo hash={address} showAvatar shortenHash={12} />
    </div>
  )
}
