import React from 'react'
import { Icon, ModalFooterConfirmation, Text, Title, GenericModal } from '@gnosis.pm/safe-react-components'
import { Transaction } from '@gnosis.pm/safe-apps-sdk'
import styled from 'styled-components'

import AddressInfo from 'src/components/AddressInfo'
import DividerLine from 'src/components/DividerLine'
import Collapse from 'src/components/Collapse'
import TextBox from 'src/components/TextBox'
import ModalTitle from 'src/components/ModalTitle'
import { mustBeEthereumAddress } from 'src/components/forms/validator'
import Bold from 'src/components/layout/Bold'
import Heading from 'src/components/layout/Heading'
import Img from 'src/components/layout/Img'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { OpenModalArgs } from 'src/routes/safe/components/Layout/interfaces'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'

const Wrapper = styled.div`
  margin-bottom: 15px;
`
const CollapseContent = styled.div`
  padding: 15px 0;

  .section {
    margin-bottom: 15px;
  }

  .value-section {
    display: flex;
    align-items: center;
  }
`

const IconText = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
  }
`
const StyledTextBox = styled(TextBox)`
  max-width: 444px;
`

type OwnProps = {
  isOpen: boolean
}

const SendTransactionModal = ({ isOpen }): React.ReactElement => {
  if (!isOpen) {
    return null
  }

  return <div></div>
}

export default SendTransactionModal
