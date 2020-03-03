// @flow
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { selectStyles, selectedTokenStyles } from './style'

import Field from '~/components/forms/Field'
import SelectField from '~/components/forms/SelectField'
import { required } from '~/components/forms/validator'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import { type State as CollectiblesState } from '~/logic/collectibles/store/reducer/collectibles'
import { formatAmount } from '~/logic/tokens/utils/formatAmount'
import { setImageToPlaceholder } from '~/routes/safe/components/Balances/utils'

type SelectedTokenProps = {
  assetAddress?: string,
  collectibles: CollectiblesState,
}

const useSelectedTokenStyles = makeStyles(selectedTokenStyles)

const SelectedToken = ({ assetAddress, collectibles }: SelectedTokenProps) => {
  const classes = useSelectedTokenStyles()
  const asset = assetAddress ? collectibles.get(assetAddress) : null

  return (
    <MenuItem className={classes.container}>
      {asset && asset.data && asset.data.length ? (
        <>
          <ListItemIcon className={classes.tokenImage}>
            <Img alt={asset.title} height={28} onError={setImageToPlaceholder} src={asset.image} />
          </ListItemIcon>
          <ListItemText
            className={classes.tokenData}
            primary={asset.title}
            secondary={`${formatAmount(asset.data.length)} ${asset.data[0].asset.symbol}`}
          />
        </>
      ) : (
        <Paragraph color="disabled" size="md" style={{ opacity: 0.5 }} weight="light">
          Select an asset*
        </Paragraph>
      )}
    </MenuItem>
  )
}

type SelectFieldProps = {
  collectibles: CollectiblesState,
  initialValue: string,
  setSelectedCollectible: Function,
}

const useTokenSelectFieldStyles = makeStyles(selectStyles)

const TokenSelectField = ({ collectibles, initialValue, setSelectedCollectible }: SelectFieldProps) => {
  const classes = useTokenSelectFieldStyles()

  return (
    <Field
      className={classes.selectMenu}
      component={SelectField}
      displayEmpty
      initialValue={initialValue}
      name="asset"
      renderValue={assetAddress => {
        setSelectedCollectible(assetAddress)
        return <SelectedToken assetAddress={assetAddress} collectibles={collectibles} />
      }}
      validate={required}
    >
      {collectibles.valueSeq().map(asset => (
        <MenuItem key={asset.slug} value={asset.data[0].assetAddress}>
          <ListItemIcon>
            <Img alt={asset.title} height={28} onError={setImageToPlaceholder} src={asset.image} />
          </ListItemIcon>
          <ListItemText
            primary={asset.title}
            secondary={`${formatAmount(asset.data.length)} ${asset.data[0].asset.symbol}`}
          />
        </MenuItem>
      ))}
    </Field>
  )
}

export default TokenSelectField
