// @flow
import React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import OpenInNew from '@material-ui/icons/OpenInNew'
import IconButton from '@material-ui/core/IconButton'
import Row from '~/components/layout/Row'
import Link from '~/components/layout/Link'
import Block from '~/components/layout/Block'
import GnoForm from '~/components/forms/GnoForm'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import Paragraph from '~/components/layout/Paragraph'
import Identicon from '~/components/Identicon'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import type { Owner } from '~/routes/safe/store/models/owner'
import { composeValidators, required, minMaxLength } from '~/components/forms/validator'
import Modal from '~/components/Modal'
import { styles } from './style'
import { secondary } from '~/theme/variables'

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const stylesModal = () => ({
  smallerModalWindow: {
    height: 'auto',
    position: 'static',
  },
})

type Props = {
  onClose: () => void,
  classes: Object,
  isOpen: boolean,
  safeAddress: string,
  ownerAddress: string,
  owners: List<Owner>,
  network: string,
  selectedOwnerName: string,
  updateSafe: Function,
}

const EditOwnerComponent = ({
  onClose,
  isOpen,
  classes,
  safeAddress,
  ownerAddress,
  selectedOwnerName,
  updateSafe,
  owners,
  network,
}: Props) => {
  const handleSubmit = (values) => {
    const ownerToUpdateIndex = owners.findIndex(o => o.address === ownerAddress)
    const updatedOwners = owners.update(ownerToUpdateIndex, owner => owner.set('name', values.ownerName))

    updateSafe({ address: safeAddress, owners: updatedOwners })
    onClose()
  }

  return (
    <Modal
      title="Edit owner from Safe"
      description="Edit owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={stylesModal.smallerModalWindow}
    >
      <Row align="center" grow className={classes.heading}>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Edit owner name
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <React.Fragment>
            <Block className={classes.container}>
              <Row margin="md">
                <Field
                  name="ownerName"
                  component={TextField}
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                  placeholder="Owner name*"
                  text="Owner name*"
                  initialValue={selectedOwnerName}
                  className={classes.addressInput}
                />
              </Row>
              <Row>
                <Block align="center" className={classes.user}>
                  <Identicon address={ownerAddress} diameter={32} />
                  <Paragraph style={{ marginLeft: 10 }} size="md" color="disabled" noMargin>
                    {ownerAddress}
                  </Paragraph>
                  <Link className={classes.open} to={getEtherScanLink(ownerAddress, network)} target="_blank">
                    <OpenInNew style={openIconStyle} />
                  </Link>
                </Block>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button className={classes.button} minWidth={140} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className={classes.button} variant="contained" minWidth={140} color="primary">
                Save
              </Button>
            </Row>
          </React.Fragment>
        )}
      </GnoForm>
    </Modal>
  )
}

const EditOwnerModal = withStyles(styles)(EditOwnerComponent)

export default EditOwnerModal
