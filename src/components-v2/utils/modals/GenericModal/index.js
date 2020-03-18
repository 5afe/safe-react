// @flow
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React, { type Node } from 'react'
import styled from 'styled-components'

import Modal from '~/components/Modal'
import Hairline from '~/components/layout/Hairline'

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 20px;
`
const BodySection = styled.div`
  padding: 10px 20px;
  max-height: 460px;
  overflow-y: auto;
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
  }),
)

type Props = {
  title: string,
  body: Node,
  footer: Node,
  onClose: () => void,
}

const GenericModal = ({ body, footer, onClose, title }: Props) => {
  const classes = useStyles()

  return (
    <Modal description="GenericModal" handleClose={onClose} open paperClassName={classes.paper} title="GenericModal">
      <TitleSection>
        {title}
        <IconButton disableRipple onClick={onClose}>
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
