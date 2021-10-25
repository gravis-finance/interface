import { MenuEntry, urlSearchLanguageParam } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../hooks'

const menuLinks: MenuEntry[] = [
  {
    label: 'mainMenu.home',
    icon: 'HomeIcon',
    href: `${process.env.REACT_APP_HOME_URL}`,
    external: true,
  },
  {
    label: 'mainMenu.asteroidMining',
    icon: 'AsteroidMiningIcon',
    blink: true,
    items: [
      {
        label: 'mainMenu.buyLootBoxes',
        href: `${process.env.REACT_APP_ASTEROID_MINING_URL}/lootboxes`,
        external: true,
      },
      {
        label: 'mainMenu.hangar',
        href: `${process.env.REACT_APP_ASTEROID_MINING_URL}/hangar`,
        external: true,
      },
      {
        label: 'mainMenu.dashboard',
        href: `${process.env.REACT_APP_ASTEROID_MINING_URL}/dashboard`,
        external: true,
      },
      {
        label: '(A)steroid pitch deck',
        href: 'https://gateway.pinata.cloud/ipfs/QmWPNbXLtqh1gkXEe5BR5BLadGcz7sYAXjooSzrouBi9an',
        external: true,
      },
      {
        label: 'mainMenu.docs',
        href: 'https://docs.gravis.finance',
        external: true,
      },
    ],
  },
  {
    label: 'mainMenu.farming',
    icon: 'NFTFarmingIcon',
    items: [
      {
        label: 'mainMenu.farms',
        href: `${process.env.REACT_APP_FARMING_URL}/farms`,
        external: true,
      },
      {
        label: 'mainMenu.staking',
        href: `${process.env.REACT_APP_FARMING_URL}/staking`,
        hot: true,
        external: true,
      },
      {
        label: 'mainMenu.NFTFarming',
        href: `${process.env.REACT_APP_NFTFARMING_URL}`,
      },
      {
        label: 'mainMenu.audit',
        href: 'https://github.com/chainsulting/Smart-Contract-Security-Audits/blob/master/Gravis%20Finance/02_Smart%20Contract%20Audit_GravisFinance_Farm.pdf',
        external: true,
      },
    ],
  },
  {
    label: 'mainMenu.trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'swap',
        href: `/swap`,
      },
      {
        label: 'mainMenu.liquidity',
        href: `/pool`,
      },
      {
        label: 'mainMenu.migrate',
        href: `/migrate`,
      },
      {
        label: 'mainMenu.analytics.analytics',
        href: `${process.env.REACT_APP_INFO_URL}`,
        external: true,
      },
    ],
  },
  {
    label: 'mainMenu.nftmarket',
    icon: 'NFTMarketIcon',
    items: [
      {
        label: 'buyNFT',
        href: `${process.env.REACT_APP_GMART_URL}/buy`,
      },
      {
        label: 'sellNFT',
        href: `${process.env.REACT_APP_GMART_URL}/sell`,
      },
      {
        label: 'sendNFT',
        href: `${process.env.REACT_APP_GMART_URL}/transfer`,
      },
      {
        label: 'Activity',
        href: `${process.env.REACT_APP_GMART_URL}/activity`,
      },
    ],
  },
  {
    label: 'mainMenu.more',
    icon: 'MoreIcon',
    items: [
      {
        label: 'mainMenu.github',
        href: 'https://github.com/gravis-finance',
        external: true,
      },
      {
        label: 'mainMenu.blog',
        href: 'https://gravis-finance.medium.com/',
        external: true,
      },
      {
        label: 'mainMenu.pitchDeck',
        href: 'https://gateway.pinata.cloud/ipfs/QmNg3RR7BYiSbcKKLZLz3Kb18y6fZa5jruJ9VFacV4WfdW',
        external: true,
      },
      {
        label: 'mainMenu.tokenomics',
        href: 'https://docs.google.com/spreadsheets/d/1JfHN1J_inbAbANSCuspO8CIWuyiCDLB36pcuHItW0eM/edit#gid=1509806282',
        external: true,
      },
    ],
  },
]

const useGetMenuLinks = (): MenuEntry[] => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const onlyBscLabels = [t('buyNFT'), t('sellNFT'), t('sendNFT'), t('Activity'), t('mainMenu.NFTFarming')]

  let newMenuLinks = [...menuLinks]
  newMenuLinks = newMenuLinks.map((link) => {
    const newLink = { ...link }
    newLink.label = t(newLink.label)
    newLink.href = `${newLink.href}?network=${chainId}&${urlSearchLanguageParam}=${t('language')}`
    if (newLink.items) {
      newLink.items = newLink.items.map((item) => {
        const newItem = { ...item }
        newItem.label = t(newItem.label)
        if (!onlyBscLabels.includes(newItem.label))
          newItem.href = `${newItem.href}?network=${chainId}&${urlSearchLanguageParam}=${t('language')}`
        return newItem
      })
    }
    return newLink
  })

  return newMenuLinks
}

export default useGetMenuLinks
