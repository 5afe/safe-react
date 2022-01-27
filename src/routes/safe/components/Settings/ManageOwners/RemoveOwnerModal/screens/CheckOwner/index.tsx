import { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { Modal } from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { OwnerData } from 'src/routes/safe/components/Settings/ManageOwners/dataFetcher'

import { useStyles } from './style'
import { getStepTitle } from 'src/routes/safe/components/Balances/SendModal/utils'

export const REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID = 'remove-owner-next-btn'

interface CheckOwnerProps {
  onClose: () => void
  onSubmit: () => void
  owner: OwnerData
}

export const CheckOwner = ({ onClose, onSubmit, owner }: CheckOwnerProps): ReactElement => {
  const classes = useStyles()

  return (
    <>
      <ModalHeader onClose={onClose} subTitle={getStepTitle(1, 3)} title="Remove owner" />
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="md">
          <Paragraph size="lg">Review the owner you want to remove from the active Safe:</Paragraph>
        </Row>
        <Row>
          <Col align="center" xs={12}>
            <PrefixedEthHashInfo
              hash={owner.address}
              name={owner.name}
              showCopyBtn
              showAvatar
              explorerUrl={getExplorerInfo(owner.address)}
            />
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
