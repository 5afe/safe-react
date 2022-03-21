import { Fragment, useEffect, useState } from 'react'
import Card from '@material-ui/core/Card'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { Virtuoso } from 'react-virtuoso'

import Item from './components/Item'

import Paragraph from 'src/components/layout/Paragraph'
import {
  nftAssetsFromNftTokensSelector,
  nftLoadedSelector,
  orderedNFTAssets,
} from 'src/logic/collectibles/store/selectors'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { fontColor, lg, screenSm, screenXs } from 'src/theme/variables'
import { useAnalytics, SAFE_EVENTS } from 'src/utils/googleAnalytics'
import { NFTToken } from 'src/logic/collectibles/sources/collectibles.d'

const useStyles = makeStyles(
  createStyles({
    cardInner: {
      boxSizing: 'border-box',
      maxWidth: '100%',
      padding: '52px 54px',
    },
    cardOuter: {
      boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    },
    gridRow: {
      boxSizing: 'border-box',
      columnGap: '30px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      marginBottom: '45px',
      maxWidth: '100%',
      rowGap: '45px',

      '&:last-child': {
        marginBottom: '0',
      },

      [`@media (min-width: ${screenXs}px)`]: {
        gridTemplateColumns: '1fr 1fr',
      },

      [`@media (min-width: ${screenSm}px)`]: {
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
      },
    },
    title: {
      alignItems: 'center',
      display: 'flex',
      margin: '18px',
    },
    titleImg: {
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      borderRadius: '50%',
      height: '45px',
      margin: '0 10px 0 0',
      width: '45px',
    },
    titleText: {
      color: fontColor,
      fontSize: '18px',
      fontWeight: 'normal',
      lineHeight: '1.2',
      margin: '0',
    },
    titleFiller: {
      backgroundColor: '#e8e7e6',
      flexGrow: 1,
      height: '2px',
      marginLeft: '40px',
    },
    noData: {
      fontSize: lg,
      textAlign: 'center',
    },
  }),
)

const Collectibles = (): React.ReactElement => {
  const { trackEvent } = useAnalytics()
  const classes = useStyles()
  const [selectedToken, setSelectedToken] = useState<NFTToken | undefined>()
  const [sendNFTsModalOpen, setSendNFTsModalOpen] = useState(false)

  const nftLoaded = useSelector(nftLoadedSelector)
  const nftTokens = useSelector(orderedNFTAssets)
  const nftAssetsFromNftTokens = useSelector(nftAssetsFromNftTokensSelector)

  useEffect(() => {
    trackEvent(SAFE_EVENTS.COLLECTIBLES)
  }, [trackEvent])

  const handleItemSend = (nftToken: NFTToken) => {
    setSelectedToken(nftToken)
    setSendNFTsModalOpen(true)
  }

  if (nftAssetsFromNftTokens.length === 0) {
    return (
      <Card className={classes.cardOuter}>
        <div className={classes.cardInner}>
          <Paragraph className={classes.noData}>
            {nftLoaded ? 'No collectibles available' : 'Loading collectibles...'}
          </Paragraph>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Virtuoso
        style={{
          height: 'calc(100% - 54px)', // Remove breadcrumb height
        }}
        data={nftAssetsFromNftTokens}
        itemContent={(_, nftAsset) => {
          // Larger collectible lists can cause this to be initially undefined
          if (!nftAsset) {
            return null
          }

          return (
            <Fragment key={nftAsset.slug}>
              <div className={classes.title}>
                <div className={classes.titleImg} style={{ backgroundImage: `url(${nftAsset.image || ''})` }} />
                <h2 className={classes.titleText}>{nftAsset.name}</h2>
                <div className={classes.titleFiller} />
              </div>
              <div className={classes.gridRow}>
                {nftTokens
                  .filter(({ assetAddress }) => nftAsset.address === assetAddress)
                  .map((nftToken, i) => (
                    <Item
                      data={nftToken}
                      key={`${nftAsset.slug}_${nftToken.tokenId}_${i}`}
                      onSend={() => handleItemSend(nftToken)}
                    />
                  ))}
              </div>
            </Fragment>
          )
        }}
      />
      <SendModal
        activeScreenType="sendCollectible"
        isOpen={sendNFTsModalOpen}
        onClose={() => setSendNFTsModalOpen(false)}
        selectedToken={selectedToken}
      />
    </>
  )
}

export default Collectibles
