// @flow
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiList from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import Search from '@material-ui/icons/Search'
import cn from 'classnames'
import { List } from 'immutable'
import SearchBar from 'material-ui-search-bar'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FixedSizeList } from 'react-window'

import { styles } from './style'

import Spacer from '~/components/Spacer'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Divider from '~/components/layout/Divider'
import Hairline from '~/components/layout/Hairline'
import Row from '~/components/layout/Row'
import type { NFTAssetsState } from '~/logic/collectibles/store/reducer/collectibles'
import { nftAssetsListSelector } from '~/logic/collectibles/store/selectors'
import type { NFTAsset } from '~/routes/safe/components/Balances/Collectibles/types'
import AssetRow from '~/routes/safe/components/Balances/Tokens/screens/AssetsList/AssetRow'
import updateActiveAssets from '~/routes/safe/store/actions/updateActiveAssets'
import updateBlacklistedAssets from '~/routes/safe/store/actions/updateBlacklistedAssets'
import {
  safeActiveAssetsListSelector,
  safeBlacklistedAssetsSelector,
  safeParamAddressFromStateSelector,
} from '~/routes/safe/store/selectors'
const useStyles = makeStyles(styles)

export const ADD_CUSTOM_ASSET_BUTTON_TEST_ID = 'add-custom-asset-btn'
type Props = {
  setActiveScreen: Function,
}

const filterBy = (filter: string, nfts: List<NFTAsset>): List<NFTAsset> =>
  nfts.filter(
    (asset: NFTAsset) =>
      !filter ||
      asset.description.toLowerCase().includes(filter.toLowerCase()) ||
      asset.name.toLowerCase().includes(filter.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(filter.toLowerCase()),
  )

const AssetsList = (props: Props) => {
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
  const nftAssetsList: NFTAssetsState = useSelector(nftAssetsListSelector)

  useEffect(() => {
    dispatch(updateActiveAssets(safeAddress, activeAssetsAddresses))
    dispatch(updateBlacklistedAssets(safeAddress, blacklistedAssetsAddresses))
  }, [activeAssetsAddresses, blacklistedAssetsAddresses])

  const onCancelSearch = () => {
    setFilterValue('')
  }

  const onChangeSearchBar = (value: string) => {
    setFilterValue(value)
  }

  const getItemKey = index => {
    return index
  }

  const onSwitch = (asset: NFTAsset) => () => {
    const { address } = asset
    const activeAssetsAddressesResult = activeAssetsAddresses.contains(address)
      ? activeAssetsAddresses.remove(address)
      : activeAssetsAddresses.add(address)
    const blacklistedAssetsAddressesResult = activeAssetsAddresses.has(address)
      ? blacklistedAssetsAddresses.add(address)
      : blacklistedAssetsAddresses.remove(address)
    setActiveAssetsAddresses(activeAssetsAddressesResult)
    setBlacklistedAssetsAddresses(blacklistedAssetsAddressesResult)
    return {
      activeAssetsAddresses: activeAssetsAddressesResult,
      blacklistedAssetsAddresses: blacklistedAssetsAddressesResult,
    }
  }

  const createItemData = assetsList => {
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
      {!nftAssetsList.size && (
        <Block className={classes.progressContainer} justify="center">
          <CircularProgress />
        </Block>
      )}
      {nftAssetsList.size > 0 && (
        <MuiList className={classes.list}>
          <FixedSizeList
            height={413}
            itemCount={nftAssetsFilteredList.size}
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
