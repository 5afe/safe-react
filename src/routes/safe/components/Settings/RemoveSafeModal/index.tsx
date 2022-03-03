import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { useDispatch, useSelector } from 'react-redux'

import { useStyles } from './style'
import Modal, { Modal as GenericModal } from 'src/components/Modal'
import Block from 'src/components/layout/Block'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import removeSafe from 'src/logic/safe/store/actions/removeSafe'
import { getChainById, getExplorerInfo } from 'src/config'
import Col from 'src/components/layout/Col'
import { WELCOME_ROUTE, history, SafeRouteParams, generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import useLocalSafes, { LocalSafes } from 'src/logic/safe/hooks/useLocalSafes'
import { currentChainId } from 'src/logic/config/store/selectors'
import { useMemo } from 'react'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'

type RemoveSafeModalProps = {
  isOpen: boolean
  onClose: () => void
}

function getNextAvailableSafe(currentChainId: string, currentSafeAddress: string, localSafes: LocalSafes) {
  const availableSafes = Object.values(localSafes)
    .flat()
    .filter((safe) => safe.address !== currentSafeAddress)
  const sameNetworkSafes = availableSafes.filter((safe) => safe.chainId === currentChainId)

  if (sameNetworkSafes.length > 0) {
    return sameNetworkSafes[0]
  }
}

function getDestinationRoute(nextAvailableSafe: SafeRecordProps | undefined) {
  if (!nextAvailableSafe || !nextAvailableSafe.chainId) return WELCOME_ROUTE

  const { shortName } = getChainById(nextAvailableSafe.chainId)
  const routesSlug: SafeRouteParams = {
    shortName,
    safeAddress: nextAvailableSafe.address,
  }
  return generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, routesSlug)
}

const RemoveSafeModal = ({ isOpen, onClose }: RemoveSafeModalProps): React.ReactElement => {
  const classes = useStyles()
  const { address: safeAddress, name: safeName } = useSelector(currentSafeWithNames)
  const curChainId = useSelector(currentChainId)
  const localSafes = useLocalSafes()
  const nextAvailableSafe = useMemo(
    () => getNextAvailableSafe(curChainId, safeAddress, localSafes),
    [curChainId, safeAddress, localSafes],
  )
  const dispatch = useDispatch()

  const onRemoveSafeHandler = async () => {
    const destination = getDestinationRoute(nextAvailableSafe)
    dispatch(removeSafe(safeAddress))
    onClose()
    history.push(destination)
  }

  return (
    <Modal
      description="Remove the selected Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName="modal"
      title="Remove Safe"
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Remove Safe
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row className={classes.owner}>
          <Col align="center" xs={12}>
            <PrefixedEthHashInfo
              hash={safeAddress}
              name={safeName}
              showAvatar
              showCopyBtn
              explorerUrl={getExplorerInfo(safeAddress)}
            />
          </Col>
        </Row>
        <Row className={classes.description}>
          <Paragraph noMargin size="lg">
            Removing a Safe only removes it from your interface. <b>It does not delete the Safe</b>. You can always add
            it back using the Safe&apos;s address.
          </Paragraph>
        </Row>
      </Block>
      <GenericModal.Footer>
        <GenericModal.Footer.Buttons
          cancelButtonProps={{ onClick: onClose }}
          confirmButtonProps={{
            onClick: onRemoveSafeHandler,
            color: 'error',
            text: 'Remove',
          }}
        />
      </GenericModal.Footer>
    </Modal>
  )
}

export default RemoveSafeModal
