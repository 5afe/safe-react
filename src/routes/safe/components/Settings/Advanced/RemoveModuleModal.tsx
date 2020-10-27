import { Button } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import OpenInNew from '@material-ui/icons/OpenInNew'
import cn from 'classnames'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import Identicon from 'src/components/Identicon'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Link from 'src/components/layout/Link'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import Modal from 'src/components/Modal'
import { getExplorerInfo } from 'src/config'
import { getDisableModuleTxData } from 'src/logic/safe/utils/modules'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'

import { ModulePair } from 'src/logic/safe/store/models/safe'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { md, secondary } from 'src/theme/variables'

import { styles } from './style'

const useStyles = makeStyles(styles)

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

const openIconStyle = {
  height: md,
  color: secondary,
}

interface RemoveModuleModal {
  onClose: () => void
  selectedModule: ModulePair
}

const RemoveModuleModal = ({ onClose, selectedModule }: RemoveModuleModal): React.ReactElement => {
  const classes = useStyles()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const dispatch = useDispatch()

  const explorerInfo = getExplorerInfo(selectedModule[0])
  const { url } = explorerInfo()

  const removeSelectedModule = async (): Promise<void> => {
    try {
      const txData = getDisableModuleTxData(selectedModule, safeAddress)

      dispatch(
        createTransaction({
          safeAddress,
          to: safeAddress,
          valueInWei: '0',
          txData,
          notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
        }),
      )
    } catch (e) {
      console.error(`failed to remove the module ${selectedModule}`, e.message)
    }
  }

  return (
    <>
      <Modal
        description="Remove the selected Module"
        handleClose={onClose}
        paperClassName={classes.modal}
        title="Remove Module"
        open
      >
        <Row align="center" className={classes.modalHeading} grow>
          <Paragraph className={classes.modalManage} noMargin weight="bolder">
            Remove Module
          </Paragraph>
          <IconButton disableRipple onClick={onClose}>
            <Close className={classes.modalClose} />
          </IconButton>
        </Row>
        <Hairline />
        <Block className={classes.modalContainer}>
          <Row className={classes.modalOwner}>
            <Col align="center" xs={1}>
              <Identicon address={selectedModule[0]} diameter={32} />
            </Col>
            <Col xs={11}>
              <Block className={cn(classes.modalName, classes.modalUserName)}>
                <Paragraph noMargin size="lg" weight="bolder">
                  {selectedModule[0]}
                </Paragraph>
                <Block className={classes.modalUser} justify="center">
                  <Paragraph color="disabled" noMargin size="md">
                    {selectedModule[0]}
                  </Paragraph>
                  <Link className={classes.modalOpen} target="_blank" to={url}>
                    <OpenInNew style={openIconStyle} />
                  </Link>
                </Block>
              </Block>
            </Col>
          </Row>
          <Hairline />
          <Row className={classes.modalDescription}>
            <Paragraph noMargin>
              After removing this module, any feature or app that uses this module might no longer work. If this Safe
              requires more then one signature, the module removal will have to be confirmed by other owners as well.
            </Paragraph>
          </Row>
        </Block>
        <Hairline />
        <Row align="center" className={classes.modalButtonRow}>
          <FooterWrapper>
            <Button size="md" color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button color="error" size="md" variant="contained" onClick={removeSelectedModule}>
              Remove
            </Button>
          </FooterWrapper>
        </Row>
      </Modal>
    </>
  )
}

export default RemoveModuleModal
