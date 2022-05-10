import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'

import { selectStyles, selectedTokenStyles } from '../style'

import Field from 'src/components/forms/Field'
import SelectField from 'src/components/forms/SelectField'
import { required } from 'src/components/forms/validator'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { textShortener } from 'src/utils/strings'
import { NFTAssets } from 'src/logic/collectibles/sources/collectibles.d'

const useSelectedTokenStyles = makeStyles(selectedTokenStyles)

type SelectedTokenProps = {
  assetAddress?: string
  assets: NFTAssets
}

const SelectedToken = ({ assetAddress, assets }: SelectedTokenProps): React.ReactElement => {
  const classes = useSelectedTokenStyles()
  const asset = assetAddress ? assets[assetAddress] : null
  const shortener = textShortener({ charsStart: 40, charsEnd: 0 })

  return (
    <MenuItem className={classes.container} disableRipple>
      {asset && asset.numberOfTokens ? (
        <>
          <ListItemIcon>
            <Img className={classes.tokenImage} alt={asset.name} onError={setImageToPlaceholder} src={asset.image} />
          </ListItemIcon>
          <ListItemText
            className={classes.tokenData}
            primary={shortener(asset.name)}
            secondary={`${formatAmount(asset.numberOfTokens.toString())} ${asset.symbol}`}
          />
        </>
      ) : (
        <Paragraph color="disabled" size="md" style={{ opacity: 0.5 }} weight="light" noMargin>
          Select an asset*
        </Paragraph>
      )}
    </MenuItem>
  )
}

const useTokenSelectFieldStyles = makeStyles(selectStyles)

type TokenSelectFieldProps = {
  assets: NFTAssets
  initialValue?: string
}

const TokenSelectField = ({ assets, initialValue }: TokenSelectFieldProps): React.ReactElement => {
  const classes = useTokenSelectFieldStyles()
  const tokenClasses = useSelectedTokenStyles()
  const assetsAddresses = Object.keys(assets)

  return (
    <Field
      className={classes.selectMenu}
      component={SelectField}
      disabled={!assetsAddresses.length}
      initialValue={initialValue}
      name="assetAddress"
      displayEmpty
      renderValue={(assetAddress) => <SelectedToken assetAddress={assetAddress} assets={assets} />}
      validate={required}
    >
      {assetsAddresses.map((assetAddress) => {
        const asset = assets[assetAddress]

        return (
          <MenuItem key={asset.slug} value={assetAddress}>
            <ListItemIcon>
              <Img
                className={tokenClasses.tokenImage}
                alt={asset.name}
                onError={setImageToPlaceholder}
                src={asset.image}
              />
            </ListItemIcon>
            <ListItemText
              primary={asset.name}
              secondary={`Count: ${formatAmount(asset.numberOfTokens.toString())} ${asset.symbol}`}
            />
          </MenuItem>
        )
      })}
    </Field>
  )
}

export default TokenSelectField
