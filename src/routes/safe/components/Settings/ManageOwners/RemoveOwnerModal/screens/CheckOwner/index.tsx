import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { Modal } from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

import { useStyles } from './style'
import { useSelector } from 'react-redux'
import { currentBlockExplorerInfo } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'

export const REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID = 'remove-owner-next-btn'

interface CheckOwnerProps {
  onClose: () => void
  onSubmit: () => void
  owner: OwnerData
}

export const CheckOwner = ({ onClose, onSubmit, owner }: CheckOwnerProps): ReactElement => {
  const classes = useStyles()
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, owner.address))

  return (
    <>
      <ModalHeader onClose={onClose} subTitle="1 of 3" title="Remove owner" />
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="md">
          <Paragraph size="lg">Review the owner you want to remove from the active Safe:</Paragraph>
        </Row>
        <Row>
          <Col align="center" xs={12}>
            <EthHashInfo hash={owner.address} name={owner.name} showCopyBtn showAvatar explorerUrl={explorerUrl} />
          </Col>
        </Row>
      </Block>
      <Modal.Footer>
        <Modal.Footer.Buttons
          cancelButtonProps={{ onClick: onClose }}
          confirmButtonProps={{ onClick: onSubmit, testId: REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID, text: 'Next' }}
        />
      </Modal.Footer>
    </>
  )
}
