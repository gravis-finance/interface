import React, { lazy, useEffect, useState } from 'react'
import { MenuEntry, urlSearchLanguageParam, useModal, getNetworkForAnalytics } from '@gravis.finance/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { BASE_CURRENCIES, ChainId } from '@gravis.finance/sdk'
import { getExplorerLink, getExplorerName } from 'utils'
import { useActiveWeb3React } from 'hooks'
import i18next from '../../i18n'
import RecentTransactionsModal from '../PageHeader/RecentTransactionsModal'

const UikitMenu = lazy(() =>
  import('@gravis.finance/uikit/dist/esm/widgets/Menu').then(({ Menu }) => ({ default: Menu }))
)

const Menu: React.FC<{ loginBlockVisible?: boolean }> = ({ loginBlockVisible, ...props }) => {
  const { t } = useTranslation()

  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const balance = useCurrencyBalance(account as string, BASE_CURRENCIES[chainId as ChainId])
  const explorerName = getExplorerName(chainId as ChainId)
  const explorerLink = getExplorerLink(chainId as ChainId, account as string, 'address')
  const [selectedLanguage, setSelectedLanguage] = useState('')

  const useBalance = async () => {
    const result = await balance
    return result
  }

  const links: MenuEntry[] = React.useMemo(
    () => [
      {
        label: t('mainMenu.home'),
        icon: 'HomeIcon',
        href: `${process.env.REACT_APP_HOME_URL}?${urlSearchLanguageParam}=${t('language')}`,
      },
      {
        label: t('mainMenu.asteroidMining'),
        icon: 'AsteroidMiningIcon',
        blink: true,
        items: [
          {
            label: t('mainMenu.buyLootBoxes'),
            href: `${process.env.REACT_APP_ASTEROID_MINING_URL}?${urlSearchLanguageParam}=${t('language')}`,
          },
          {
            label: t('mainMenu.hangar'),
            href: `${process.env.REACT_APP_ASTEROID_MINING_URL}/hangar?${urlSearchLanguageParam}=${t('language')}`,
          },
          {
            label: '(A)steroid pitch deck',
            href: 'https://gateway.pinata.cloud/ipfs/QmWPNbXLtqh1gkXEe5BR5BLadGcz7sYAXjooSzrouBi9an'
          },
          {
            label: t('mainMenu.docs'),
            href: 'https://docs.gravis.finance',
            external: true
          }
        ]
      },
      {
        label: t('mainMenu.trade'),
        icon: 'TradeIcon',
        items: [
          {
            label: t('swap'),
            href: '/swap',
          },
          {
            label: t('mainMenu.liquidity'),
            href: '/pool',
          },
          {
            label: t('mainMenu.migrate'),
            href: '/migrate',
          },
          {
            label: t('mainMenu.analytics.analytics'),
            href: `${process.env.REACT_APP_INFO_URL}/home?network=${getNetworkForAnalytics(chainId)}&${urlSearchLanguageParam}=${t('language')}`,
          },
        ],
      },
      // {
      //   label: t('mainMenu.analytics.analytics'),
      //   icon: 'InfoIcon',
      //   items: [
      //     {
      //       label: t('mainMenu.analytics.overview'),
      //       href: `${process.env.REACT_APP_INFO_URL}/home?network=${getNetworkForAnalytics(chainId)}&${urlSearchLanguageParam}=${t('language')}`,
      //     },
      //     {
      //       label: t('mainMenu.analytics.tokens'),
      //       href: `${process.env.REACT_APP_INFO_URL}/tokens?network=${getNetworkForAnalytics(
      //         chainId
      //       )}&${urlSearchLanguageParam}=${t('language')}`,
      //     },
      //     {
      //       label: t('mainMenu.analytics.pairs'),
      //       href: `${process.env.REACT_APP_INFO_URL}/pairs?network=${getNetworkForAnalytics(
      //         chainId
      //       )}&${urlSearchLanguageParam}=${t('language')}`,
      //     },
      //   ],
      // },
      {
        label: t('mainMenu.nftmarket'),
        icon: 'NFTMarketIcon',
        items: [
          {
            label: t('buyNFT'),
            href: `${process.env.REACT_APP_GMART_URL}/buy?${urlSearchLanguageParam}=${t('language')}`,
          },
          {
            label: t('sellNFT'),
            href: `${process.env.REACT_APP_GMART_URL}/sell?${urlSearchLanguageParam}=${t('language')}`,
          },
          {
            label: t('sendNFT'),
            href: `${process.env.REACT_APP_GMART_URL}/transfer?${urlSearchLanguageParam}=${t('language')}`,
          },
        ]
      },
      {
        label: t('mainMenu.NFTFarming'),
        icon: 'NFTFarmingIcon',
        href: `${process.env.REACT_APP_NFTFARMING_URL}?${urlSearchLanguageParam}=${t('language')}`
      },
      {
        label: t('mainMenu.more'),
        icon: 'MoreIcon',
        items: [
          // {
          //   label: 'Audits',
          //   href: '/audits',
          // },
          {
            label: t('mainMenu.github'),
            href: 'https://github.com/gravis-finance',
          },
          {
            label: t('mainMenu.blog'),
            href: 'https://gravis-finance.medium.com/',
          },
          {
            label: t('mainMenu.pitchDeck'),
            href: t('presentationLink'),
          },
          {
            label: t('mainMenu.tokenomics'),
            href: 'https://docs.google.com/spreadsheets/d/1JfHN1J_inbAbANSCuspO8CIWuyiCDLB36pcuHItW0eM/edit#gid=1509806282',
          },
        ],
      },
    ],
    [t, chainId]
  )

  useEffect(() => {
    i18next.changeLanguage(selectedLanguage.toLowerCase())
  }, [selectedLanguage])

  // useBalance().then((result)=>console.log(result))

  const transactionsHistoryModalComponent = React.useMemo(() => <RecentTransactionsModal />, [])

  const [transactionsHistoryModal] = useModal(transactionsHistoryModalComponent)

  return (
    <UikitMenu
      isProduction={process.env.REACT_APP_NODE_ENV === 'production'}
      links={links}
      account={account as string}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      loginBlockVisible={loginBlockVisible}
      buttonTitle={t('connect')}
      balance={balance?.toSignificant(6)}
      explorerName={explorerName}
      explorerLink={explorerLink}
      options={{
        modalTitle: t('account'),
        modalFooter: t('learnHowConnect'),
        modelLogout: t('logout'),
        modalBscScan: t('viewOnBscscan'),
        modelCopyAddress: t('copyAddress'),
      }}
      onTransactionHistoryHandler={transactionsHistoryModal}
      betaText=""
      betaLink="https://beta.exchange.gravis.finance"
      balanceHook={useBalance}
      setSelectedLanguage={setSelectedLanguage}
      {...props}
    />
  )
}

export default Menu
