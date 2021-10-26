import FormGroup from '@material-ui/core/FormGroup/FormGroup'
import Checkbox from '@material-ui/core/Checkbox/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel'
import { ChangeEvent, ReactElement } from 'react'

import Block from 'src/components/layout/Block'
import styled from 'styled-components'
import { lg } from 'src/theme/variables'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph'
import { copyShortNameSelector, showShortNameSelector } from 'src/logic/appearance/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { setShowShortName } from 'src/logic/appearance/actions/setShowShortName'
import { setCopyShortName } from 'src/logic/appearance/actions/setCopyShortName'
import { extractPrefixedSafeAddress } from 'src/routes/routes'

// Other settings sections use MUI createStyles .container
// will adjust that during dark mode implementation
const Container = styled(Block)`
  padding: ${lg};
`

const Appearance = (): ReactElement => {
  const dispatch = useDispatch()
  const copyShortName = useSelector(copyShortNameSelector)
  const showShortName = useSelector(showShortNameSelector)

  const { shortName, safeAddress } = extractPrefixedSafeAddress()

  const handleShowChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
    dispatch(setShowShortName({ showShortName: checked }))
  const handleCopyChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
    dispatch(setCopyShortName({ copyShortName: checked }))

  return (
    <Container>
      <Heading tag="h2">Use Chain-Specific Addresses</Heading>
      <Paragraph>You can choose whether to prepend EIP-3770 short chain names accross Safes.</Paragraph>
      <Paragraph>
        {showShortName && <strong>{shortName}:</strong>}
        {safeAddress}
      </Paragraph>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={showShortName} onChange={handleShowChange} name="showShortName" />}
          label="Prepend addresses with chain prefix."
        />
        <FormControlLabel
          control={<Checkbox checked={copyShortName} onChange={handleCopyChange} name="copyShortName" />}
          label="Copy addresses with chain prefix."
        />
      </FormGroup>
    </Container>
  )
}

export default Appearance
