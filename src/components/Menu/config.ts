import { MenuEntry, privacyAndPoliceLink, termsOfUseLink } from '@gravis.finance/uikit'

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
        label: 'Evervoid 2.0',
        href: process.env.REACT_APP_ASTEROID_MINING_URL,
        external: true
      },
      {
        label: 'mainMenu.home',
        href: `${process.env.REACT_APP_ASTEROID_MINING_URL}/home`,
        external: true
      },
      {
        label: 'mainMenu.missions',
        href: `${process.env.REACT_APP_ASTEROID_MINING_URL}/missions`,
        external: true
      },
      {
        label: 'mainMenu.buyLootBoxes',
        href: `${process.env.REACT_APP_ASTEROID_MINING_URL}/lootboxes`,
        external: true
      },
    ],
    chip: {
      title: 'GAME',
      color: 'rgb(235, 149, 0)',
    },
  },
  {
    label: 'mainMenu.trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'mainMenu.autofarming',
        href: `${process.env.REACT_APP_AUTOFARMING_URL}`,
        external: true,
        chip: {
          title: 'HOT',
          color: 'rgb(235, 149, 0)',
          animation: true,
        },
      },
      {
        label: 'swap',
        href: `/swap`,
      },
      {
        label: 'mainMenu.farming',
        href: `${process.env.REACT_APP_FARMING_URL}/farms`,
        external: true,
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
        label: 'Multi-chain Bridge',
        href: `${process.env.REACT_APP_BRIDGE_URL}/swap`,
        external: true
      },
      {
        label: 'mainMenu.analytics.analytics',
        href: `${process.env.REACT_APP_INFO_URL}/home`,
        external: true,
      },
    ],
  },
  {
    label: 'mainMenu.nftmarket',
    icon: 'NFTMarketIcon',
    items: [
      {
        label: 'Explore Collections',
        href: `${process.env.REACT_APP_GMART_URL}/collections`,
        external: true
      },
      {
        label: 'buyNFT',
        href: `${process.env.REACT_APP_GMART_URL}/buy`,
        external: true
      },
      {
        label: 'sellNFT',
        href: `${process.env.REACT_APP_GMART_URL}/sell`,
        external: true
      },
      {
        label: 'sendNFT',
        href: `${process.env.REACT_APP_GMART_URL}/transfer`,
        external: true
      },
      {
        label: 'Activity',
        href: `${process.env.REACT_APP_GMART_URL}/activity`,
        external: true
      },
    ],
  },
  {
    label: 'mainMenu.publicRound',
    icon: 'TeamsIcon',
    href: `${process.env.REACT_APP_PUBLIC_ROUND_URL}`,
    external: true,
    chip: {
      title: 'GRVS',
      color: '#24BA7B',
    },
  },
  {
    label: 'mainMenu.more',
    icon: 'MoreIcon',
    items: [
      {
        label: 'mainMenu.pitchDeck',
        href: 'https://drive.google.com/file/d/1IDezUTH4W1YY2NqAEo2amxUAk7u3BLhE/view',
        external: true,
      },
      {
        label: 'mainMenu.tokenomics',
        href: 'https://docs.google.com/spreadsheets/d/1avYbOzMg7vDt5Gmw16V8WomZG8RfHtaFGEUeZHOZ8vw/edit#gid=0',
        external: true,
      },
      {
        label: 'Infographics',
        href: `${process.env.REACT_APP_HOME_URL}/info?redirectUrl=${window.location.href}`,
        external: true,
      },
      {
        label: 'mainMenu.NFTFarming',
        href: `${process.env.REACT_APP_NFTFARMING_URL}`,
        external: true,
      },
      {
        label: 'mainMenu.docs',
        href: 'https://docs.gravis.finance/',
        external: true,
      },
      {
        label: 'Terms of Use',
        href: termsOfUseLink,
        external: true,
      },
      {
        label: 'Privacy Policy',
        href: privacyAndPoliceLink,
        external: true,
      },
    ],
  },
]

export default menuLinks
