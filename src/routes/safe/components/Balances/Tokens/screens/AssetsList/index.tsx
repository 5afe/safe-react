import MuiList from '@material-ui/core/List'
import CircularProgress from '@material-ui/core/CircularProgress'
import Search from '@material-ui/icons/Search'
import cn from 'classnames'
import SearchBar from 'material-ui-search-bar'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'
import Paragraph from 'src/components/layout/Paragraph'

import { useStyles } from './style'

import Spacer from 'src/components/Spacer'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Divider from 'src/components/layout/Divider'
import Hairline from 'src/components/layout/Hairline'
import Row from 'src/components/layout/Row'
import { nftAssetsListSelector } from 'src/logic/collectibles/store/selectors'
import AssetRow from 'src/routes/safe/components/Balances/Tokens/screens/AssetsList/AssetRow'
import updateActiveAssets from 'src/logic/safe/store/actions/updateActiveAssets'
import updateBlacklistedAssets from 'src/logic/safe/store/actions/updateBlacklistedAssets'
import {
  safeActiveAssetsListSelector,
  safeBlacklistedAssetsSelector,
  safeParamAddressFromStateSelector,
} from 'src/logic/safe/store/selectors'

export const ADD_CUSTOM_ASSET_BUTTON_TEST_ID = 'add-custom-asset-btn'

type Props = {
  setActiveScreen: (newScreen: string) => void
}

const filterBy = (filter, nfts) =>
  nfts.filter(
    (asset) =>
      !filter ||
      asset.description.toLowerCase().includes(filter.toLowerCase()) ||
      asset.name.toLowerCase().includes(filter.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(filter.toLowerCase()),
  )

const AssetsList = (props: Props): React.ReactElement => {
  const classes = useStyles()
  const searchClasses = {
    input: classes.searchInput,
    root: classes.searchRoot,
    iconButton: classes.searchIcon,
    searchContainer: classes.searchContainer,
  }
  const dispatch = useDispatch()
  const activeAssetsList = useSelector(safeActiveAssetsListSelector)
  const blacklistedAssets = useSelector(safeBlacklistedAssetsSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const [filterValue, setFilterValue] = useState('')
  const [activeAssetsAddresses, setActiveAssetsAddresses] = useState(activeAssetsList)
  const [blacklistedAssetsAddresses, setBlacklistedAssetsAddresses] = useState(blacklistedAssets)
  const nftAssetsList = useSelector(nftAssetsListSelector)

  const onCancelSearch = () => {
    setFilterValue('')
  }

  const onChangeSearchBar = (value) => {
    setFilterValue(value)
  }

  const getItemKey = (index) => {
    return index
  }

  const onSwitch = (asset) => () => {
    let newActiveAssetsAddresses
    let newBlacklistedAssetsAddresses
    if (activeAssetsAddresses.has(asset.address)) {
      newActiveAssetsAddresses = activeAssetsAddresses.delete(asset.address)
      newBlacklistedAssetsAddresses = blacklistedAssetsAddresses.add(asset.address)
    } else {
      newActiveAssetsAddresses = activeAssetsAddresses.add(asset.address)
      newBlacklistedAssetsAddresses = blacklistedAssetsAddresses.delete(asset.address)
    }

    // Set local state
    setActiveAssetsAddresses(newActiveAssetsAddresses)
    setBlacklistedAssetsAddresses(newBlacklistedAssetsAddresses)
    // Dispatch to global state
    dispatch(updateActiveAssets(safeAddress, newActiveAssetsAddresses))
    dispatch(updateBlacklistedAssets(safeAddress, newBlacklistedAssetsAddresses))
  }

  const createItemData = (assetsList) => {
    return {
      assets: assetsList,
      activeAssetsAddresses,
      onSwitch,
    }
  }

  const nftAssetsFilteredList = filterBy(filterValue, nftAssetsList)
  const itemData = createItemData(nftAssetsFilteredList)
  const switchToAddCustomAssetScreen = () => props.setActiveScreen('addCustomAsset')
  return (
    <>
      <Block className={classes.root}>
        <Row align="center" className={cn(classes.padding, classes.actions)}>
          <Search className={classes.search} />
          <SearchBar
            classes={searchClasses}
            onCancelSearch={onCancelSearch}
            onChange={onChangeSearchBar}
            placeholder="Search by name or symbol"
            searchIcon={<div />}
            value={filterValue}
          />
          <Spacer />
          <Divider />
          <Spacer />
          <Button
            classes={{ label: classes.addBtnLabel }}
            className={classes.add}
            color="primary"
            disabled
            onClick={switchToAddCustomAssetScreen}
            size="small"
            testId={ADD_CUSTOM_ASSET_BUTTON_TEST_ID}
            variant="contained"
          >
            + Add custom asset
          </Button>
        </Row>
        <Hairline />
      </Block>
      {!nftAssetsList?.length && (
        <Block className={classes.progressContainer} justify="center">
          {!nftAssetsList ? <CircularProgress /> : <Paragraph>No collectibles available</Paragraph>}
        </Block>
      )}
      {nftAssetsFilteredList.length > 0 && (
        <MuiList className={classes.list}>
          <FixedSizeList
            height={413}
            itemCount={nftAssetsFilteredList.length}
            itemData={itemData}
            itemKey={getItemKey}
            itemSize={51}
            overscanCount={process.env.NODE_ENV === 'test' ? 100 : 10}
            width={500}
          >
            {AssetRow}
          </FixedSizeList>
        </MuiList>
      )}
    </>
  )
}

export default AssetsList
