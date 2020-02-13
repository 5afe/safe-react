// @flow
import React from 'react'
import styled from 'styled-components'
import Close from '@material-ui/icons/Close'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

import Modal from '~/components/Modal'
import Hairline from '~/components/layout/Hairline'

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 20px;
`
const BodySection = styled.div`
  margin: 10px 20px;
`
const FooterSection = styled.div`
  margin: 10px 20px;
`

const StyledClose = styled(Close)`
  && {
    height: 35px;
    width: 35px;
  }
`

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      height: 'auto',
      position: 'static',
    },
  })
)

type Props = {
  title: string,
  body: React.Node,
  footer: React.Node,
  onClose: () => void,
}

const GenericModal = ({ title, body, footer, onClose }: Props) => {
  const classes = useStyles()

  return (
    <Modal
      title="GenericModal"
      description="GenericModal"
      handleClose={onClose}
      paperClassName={classes.paper}
      open
    >
      <TitleSection>
        {title}
        <IconButton onClick={onClose} disableRipple>
          <StyledClose />
        </IconButton>
      </TitleSection>

      <Hairline />
      <BodySection>{body}</BodySection>

      {footer && (
        <>
          <Hairline />
          <FooterSection>{footer}</FooterSection>
        </>
      )}
    </Modal>
  )
}

export default GenericModal
