import { ReactElement, SyntheticEvent } from 'react'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import { Title, Text } from '@gnosis.pm/safe-react-components'

import { getChainById } from 'src/config'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { black300 } from 'src/theme/variables'
import fallbackSafeAppLogoSvg from 'src/assets/icons/apps.svg'
import UnknownAppWarning from 'src/routes/safe/components/Apps/components/SecurityFeedbackModal/UnknownAppWarning'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'

type SafeAppDetailsTypes = {
  iconUrl: string
  name: string
  description: string
  availableChains: string[]
  isInDefaultList: boolean
}

const SafeAppDetails = ({
  iconUrl,
  name,
  description,
  availableChains,
  isInDefaultList,
}: SafeAppDetailsTypes): ReactElement => {
  const showAvailableChains = availableChains?.length > 0
  const { isLoading: isSafeAppListLoading } = useAppList()

  return (
    <>
      <DetailsContainer>
        <SafeIcon src={iconUrl} onError={setSafeAppLogoFallback} alt={`${name || 'Safe App'} Logo`} />
        <DescriptionContainer>
          <SafeAppTitle size="sm">{name}</SafeAppTitle>
          <div>{description}</div>
        </DescriptionContainer>
      </DetailsContainer>
      <Separator />

      {/* Available chains */}
      {showAvailableChains && (
        <>
          <ChainLabel size="lg">Available networks</ChainLabel>
          <ChainsContainer>
            {availableChains.map((chainId) => {
              const chainInfo = getChainById(chainId)
              return (
                chainInfo.chainName && (
                  <div key={chainId}>
                    <NetworkLabel networkInfo={chainInfo} />
                  </div>
                )
              )
            })}
          </ChainsContainer>
          <Separator />
        </>
      )}
      {!isSafeAppListLoading && !isInDefaultList && (
        <>
          <UnknownAppWarning />
          <Separator />
        </>
      )}
    </>
  )
}

export default SafeAppDetails

const setSafeAppLogoFallback = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
  error.currentTarget.onerror = null
  error.currentTarget.src = fallbackSafeAppLogoSvg
}

const DetailsContainer = styled.div`
  display: flex;
`
const SafeIcon = styled.img`
  width: 90px;
  height: 90px;
`

const SafeAppTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 12px;
`

const DescriptionContainer = styled.div`
  padding-left: 66px;
  flex-grow: 1;
`

const Separator = styled(Divider)`
  margin: 24px 0;
`

const ChainLabel = styled(Text)`
  color: ${black300};
`
const ChainsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  && > div {
    margin-top: 12px;
    margin-right: 8px;
  }
`
