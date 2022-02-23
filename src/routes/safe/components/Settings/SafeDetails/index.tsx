import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import { ReactElement, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { styles } from './style'

import Modal from 'src/components/Modal'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, required, validAddressBookName } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { addressBookAddOrUpdate } from 'src/logic/addressBook/store/actions'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { getNotificationsFromTxType, enhanceSnackbarForAction } from 'src/logic/notifications'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import { UpdateSafeModal } from 'src/routes/safe/components/Settings/UpdateSafeModal'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'

import {
  currentSafe,
  latestMasterContractVersion as latestMasterContractVersionSelector,
  safesWithNamesAsMap,
} from 'src/logic/safe/store/selectors'
import { useAnalytics, SETTINGS_EVENTS } from 'src/utils/googleAnalytics'
import { fetchMasterCopies, MasterCopy, MasterCopyDeployer } from 'src/logic/contracts/api/masterCopies'
import { getMasterCopyAddressFromProxyAddress } from 'src/logic/contracts/safeContracts'
import ChainIndicator from 'src/components/ChainIndicator'
import { currentChainId } from 'src/logic/config/store/selectors'

export const SAFE_NAME_INPUT_TEST_ID = 'safe-name-input'
export const SAFE_NAME_SUBMIT_BTN_TEST_ID = 'change-safe-name-btn'
export const SAFE_NAME_UPDATE_SAFE_BTN_TEST_ID = 'update-safe-name-btn'

const useStyles = makeStyles(styles)

const StyledLink = styled(Link)`
  margin: 12px 0 0 0;
`
const StyledIcon = styled(Icon)`
  position: relative;
  top: 3px;
  left: 6px;
`
const StyledParagraph = styled(Paragraph)`
  margin-bottom: 0;
`

const SafeDetails = (): ReactElement => {
  const classes = useStyles()
  const isUserOwner = useSelector(grantedSelector)
  const latestMasterContractVersion = useSelector(latestMasterContractVersionSelector)
  const curChainId = useSelector(currentChainId)
  const {
    address: safeAddress,
    needsUpdate: safeNeedsUpdate,
    currentVersion: safeCurrentVersion,
    chainId = curChainId,
  } = useSelector(currentSafe)
  const safeNamesMap = useSelector(safesWithNamesAsMap)
  const safeName = safeNamesMap[safeAddress]?.name

  const dispatch = useDispatch()
  const { trackEvent } = useAnalytics()

  const [isModalOpen, setModalOpen] = useState(false)
  const [safeInfo, setSafeInfo] = useState<MasterCopy | undefined>()

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const handleSubmit = (values) => {
    dispatch(
      addressBookAddOrUpdate(
        makeAddressBookEntry({ address: safeAddress, name: values.safeName, chainId: curChainId }),
      ),
    )
    // setting `loadedViaUrl` to `false` as setting a safe's name is considered to intentionally add the safe
    dispatch(updateSafe({ address: safeAddress, loadedViaUrl: false }))

    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.SAFE_NAME_CHANGE_TX)
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(notification.afterExecution.noMoreConfirmationsNeeded)))
  }

  const handleUpdateSafe = () => {
    setModalOpen(true)
  }

  const getSafeVersion = () => {
    if (!safeInfo) {
      return ''
    }
    return safeInfo.deployer === MasterCopyDeployer.GNOSIS
      ? safeCurrentVersion
      : `${safeCurrentVersion}-${safeInfo.deployer}`
  }

  const getSafeVersionUpdate = () => {
    if (!safeInfo) {
      return ''
    }
    return safeInfo.deployer === MasterCopyDeployer.GNOSIS && safeNeedsUpdate
      ? ` (there's a newer version: ${latestMasterContractVersion})`
      : ''
  }

  useEffect(() => {
    trackEvent(SETTINGS_EVENTS.DETAILS)
  }, [trackEvent])

  useEffect(() => {
    const getMasterCopyInfo = async () => {
      const masterCopies = await fetchMasterCopies()
      const masterCopyAddress = await getMasterCopyAddressFromProxyAddress(safeAddress)
      const masterCopy = masterCopies?.find((mc) => sameAddress(mc.address, masterCopyAddress))
      setSafeInfo(masterCopy)
    }

    if (safeAddress) {
      getMasterCopyInfo()
    }
  }, [safeAddress])

  return (
    <GnoForm onSubmit={handleSubmit}>
      {() => (
        <>
          <Block className={classes.formContainer}>
            <Heading tag="h2">Contract Version</Heading>
            <Row align="end" grow>
              <StyledLink rel="noreferrer noopener" target="_blank" href={safeInfo?.deployerRepoUrl}>
                <Text size="xl" as="span" color="primary">
                  {getSafeVersion()}
                  {getSafeVersionUpdate()}
                </Text>
                <StyledIcon size="sm" type="externalLink" color="primary" />
              </StyledLink>
            </Row>
            {safeNeedsUpdate && isUserOwner ? (
              <Row align="end" grow>
                <Paragraph>
                  <Button
                    className={classes.saveBtn}
                    color="primary"
                    onClick={handleUpdateSafe}
                    size="small"
                    testId={SAFE_NAME_UPDATE_SAFE_BTN_TEST_ID}
                    variant="contained"
                  >
                    Update Safe
                  </Button>
                </Paragraph>
              </Row>
            ) : null}
          </Block>

          <Block className={classes.formContainer}>
            <Heading tag="h2">Blockchain Network</Heading>
            <StyledParagraph>
              <ChainIndicator chainId={chainId} />
            </StyledParagraph>
          </Block>

          {safeName != null && (
            <Block className={classes.formContainer}>
              <Heading tag="h2">Modify Safe Name</Heading>
              <Paragraph>
                You can change the name of this Safe. This name is only stored locally and never shared with Gnosis or
                any third parties.
              </Paragraph>
              <Block className={classes.root}>
                <Field
                  component={TextField}
                  defaultValue={safeName}
                  name="safeName"
                  placeholder="Safe name*"
                  testId={SAFE_NAME_INPUT_TEST_ID}
                  label="Safe name*"
                  type="text"
                  validate={composeValidators(required, validAddressBookName)}
                />
              </Block>
            </Block>
          )}

          <Row align="end" className={classes.controlsRow} grow>
            <Col end="xs">
              <Button
                className={classes.saveBtn}
                color="primary"
                size="small"
                testId={SAFE_NAME_SUBMIT_BTN_TEST_ID}
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            </Col>
          </Row>
          <Modal description="Update Safe" handleClose={toggleModal} open={isModalOpen} title="Update Safe">
            <UpdateSafeModal onClose={toggleModal} safeAddress={safeAddress} safeCurrentVersion={safeCurrentVersion} />
          </Modal>
        </>
      )}
    </GnoForm>
  )
}

export default SafeDetails
