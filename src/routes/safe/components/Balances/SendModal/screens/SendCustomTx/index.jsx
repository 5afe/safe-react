// @flow
import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import Col from '~/components/layout/Col'
import Button from '~/components/layout/Button'
import ScanQRModal from '~/components/ScanQRModal'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Hairline from '~/components/layout/Hairline'
import ButtonLink from '~/components/layout/ButtonLink'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import TextareaField from '~/components/forms/TextareaField'
import {
  composeValidators,
  mustBeFloat,
  maxValue,
} from '~/components/forms/validator'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/SafeInfo'
import QRIcon from '~/assets/icons/qrcode.svg'
import ArrowDown from '../assets/arrow-down.svg'
import { styles } from './style'
import { sm } from '~/theme/variables'
import AddressBookInput from '~/routes/safe/components/Balances/SendModal/screens/AddressBookInput'
import Identicon from '~/components/Identicon'
import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  safeName: string,
  ethBalance: string,
  onSubmit: Function,
  initialValues: Object,
}

const SendCustomTx = ({
  classes,
  onClose,
  safeAddress,
  safeName,
  ethBalance,
  onSubmit,
  initialValues,
}: Props) => {
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false)
  const [selectedEntry, setSelectedEntry] = useState<Object | null>({
    address: '',
    name: '',
  })
  const [pristine, setPristine] = useState<boolean>(true)
  const [isValidAddress, setIsValidAddress] = useState<boolean>(true)

  React.useMemo(() => {
    if (selectedEntry === null && pristine) {
      setPristine(false)
    }
  }, [selectedEntry, pristine])

  const handleSubmit = (values: Object) => {
    if (values.data || values.value) {
      onSubmit(values)
    }
  }

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const formMutators = {
    setMax: (args, state, utils) => {
      utils.changeValue(state, 'value', () => ethBalance)
    },
    setRecipient: (args, state, utils) => {
      utils.changeValue(state, 'recipientAddress', () => args[0])
    },
  }

  return (
    <>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Send custom transactions
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm
        onSubmit={handleSubmit}
        formMutators={formMutators}
        initialValues={initialValues}
      >
        {(...args) => {
          const mutators = args[3]

          let shouldDisableSubmitButton = !isValidAddress
          if (selectedEntry) {
            shouldDisableSubmitButton = !selectedEntry.address
          }

          const handleScan = value => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setRecipient(scannedAddress)
            closeQrModal()
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <SafeInfo
                  safeAddress={safeAddress}
                  safeName={safeName}
                  ethBalance={ethBalance}
                />
                <Row margin="md">
                  <Col xs={1}>
                    <img
                      src={ArrowDown}
                      alt="Arrow Down"
                      style={{ marginLeft: sm }}
                    />
                  </Col>
                  <Col xs={11} center="xs" layout="column">
                    <Hairline />
                  </Col>
                </Row>
                {selectedEntry && selectedEntry.address ? (
                  <div
                    role="listbox"
                    tabIndex="0"
                    onKeyDown={e => {
                      if (e.keyCode !== 9) {
                        setSelectedEntry(null)
                      }
                    }}
                  >
                    <Row margin="xs">
                      <Paragraph
                        size="md"
                        color="disabled"
                        style={{ letterSpacing: '-0.5px' }}
                        noMargin
                      >
                        Recipient
                      </Paragraph>
                    </Row>
                    <Row margin="md" align="center">
                      <Col xs={1}>
                        <Identicon
                          address={selectedEntry.address}
                          diameter={32}
                        />
                      </Col>
                      <Col xs={11} layout="column">
                        <Block justify="left">
                          <Block>
                            <Paragraph
                              weight="bolder"
                              className={classes.selectAddress}
                              noMargin
                              onClick={() => setSelectedEntry(null)}
                            >
                              {selectedEntry.name}
                            </Paragraph>
                            <Paragraph
                              weight="bolder"
                              className={classes.selectAddress}
                              noMargin
                              onClick={() => setSelectedEntry(null)}
                            >
                              {selectedEntry.address}
                            </Paragraph>
                          </Block>
                          <CopyBtn content={selectedEntry.address} />
                          <EtherscanBtn
                            type="address"
                            value={selectedEntry.address}
                          />
                        </Block>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <>
                    <Row margin="md">
                      <Col xs={11}>
                        <AddressBookInput
                          pristine={pristine}
                          fieldMutator={mutators.setRecipient}
                          setSelectedEntry={setSelectedEntry}
                          setIsValidAddress={setIsValidAddress}
                          isCustomTx
                        />
                      </Col>
                      <Col xs={1} center="xs" middle="xs" className={classes}>
                        <Img
                          src={QRIcon}
                          className={classes.qrCodeBtn}
                          role="button"
                          height={20}
                          alt="Scan QR"
                          onClick={() => {
                            openQrModal()
                          }}
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph
                      size="md"
                      color="disabled"
                      style={{ letterSpacing: '-0.5px' }}
                      noMargin
                    >
                      Value
                    </Paragraph>
                    <ButtonLink weight="bold" onClick={mutators.setMax}>
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row margin="md">
                  <Col>
                    <Field
                      name="value"
                      component={TextField}
                      type="text"
                      validate={composeValidators(
                        mustBeFloat,
                        maxValue(ethBalance)
                      )}
                      placeholder="Value*"
                      text="Value*"
                      className={classes.addressInput}
                      inputAdornment={{
                        endAdornment: (
                          <InputAdornment position="end">ETH</InputAdornment>
                        ),
                      }}
                    />
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <TextareaField
                      name="data"
                      type="text"
                      rows={3}
                      placeholder="Data (hex encoded)*"
                      text="Data (hex encoded)*"
                    />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  minWidth={140}
                  color="primary"
                  data-testid="review-tx-btn"
                  className={classes.submitButton}
                  disabled={shouldDisableSubmitButton}
                >
                  Review
                </Button>
              </Row>
              {qrModalOpen && (
                <ScanQRModal
                  isOpen={qrModalOpen}
                  onScan={handleScan}
                  onClose={closeQrModal}
                />
              )}
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(SendCustomTx)
