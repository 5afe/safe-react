import { ReactElement } from 'react'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import { Title, Text } from '@gnosis.pm/safe-react-components'

import { getChainById } from 'src/config'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { black300 } from 'src/theme/variables'

type SafeAppDetailsTypes = {
  iconUrl: string
  name: string
  description: string
  availableChains: string[]
}

const SafeAppDetails = ({ iconUrl, name, description, availableChains }: SafeAppDetailsTypes): ReactElement => {
  const showAvailableChains = availableChains?.length > 0

  return (
    <>
      <DetailsContainer>
        <SafeIcon src={iconUrl} />
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
            {availableChains.map((chainId) => (
              <div key={chainId}>
                <NetworkLabel networkInfo={getChainById(chainId)} />
              </div>
            ))}
          </ChainsContainer>
          <Separator />
        </>
      )}
    </>
  )
}

export default SafeAppDetails

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
  margin: 32px 0;
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
