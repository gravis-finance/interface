import React, { lazy, useEffect, useState } from 'react'
import { MenuEntry, useModal } from '@gravis.finance/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { ETHER, ChainId } from '@gravis.finance/sdk'
import { getExplorerLink, getExplorerName } from 'utils'
import { useActiveWeb3React } from 'hooks'
import i18next from '../../i18n'
import RecentTransactionsModal from '../PageHeader/RecentTransactionsModal'

const UikitMenu = lazy(() => import('@gravis.finance/uikit/dist/esm/widgets/Menu').then(({ Menu }) => ({ default: Menu })))

const Menu: React.FC<{ loginBlockVisible?: boolean }> = ({ loginBlockVisible, ...props }) => {
  const { t } = useTranslation()

  const links: MenuEntry[] = [
    {
      label: t('mainMenu.home'),
      icon: 'HomeIcon',
      href: process.env.REACT_APP_HOME_URL,
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
        // {
        //   label: 'Migrate',
        //   href: '/migrate',
        // },
      ],
    },
    {
      label: t('mainMenu.analytics.analytics'),
      icon: 'InfoIcon',
      items: [
        {
          label: t('mainMenu.analytics.overview'),
          href: process.env.REACT_APP_INFO_URL as string,
        },
        {
          label: t('mainMenu.analytics.tokens'),
          href: `${process.env.REACT_APP_INFO_URL}/tokens`,
        },
        {
          label: t('mainMenu.analytics.pairs'),
          href: `${process.env.REACT_APP_INFO_URL}/pairs`,
        },
      ],
    },
    {
      label: t('mainMenu.ino.ino'),
      icon: 'BigBangIcon',
      items: [
        {
          label: t('mainMenu.ino.bbRound'),
          href: `${process.env.REACT_APP_BIG_BANG_URL}`,
        },
      ],
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
          href: 'https://gateway.pinata.cloud/ipfs/QmQyWnMBruL7n7vqyVYxNXQdpm5rffj9e1Wr2Q48LU9PvY/gravis_presentation.pdf',
        },
        {
          label: t('mainMenu.tokenomics'),
          href:
            'https://docs.google.com/spreadsheets/d/1JfHN1J_inbAbANSCuspO8CIWuyiCDLB36pcuHItW0eM/edit#gid=1509806282',
        },
      ],
    },
  ]

  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const balance = useCurrencyBalance(account as string, ETHER)
  const explorerName = getExplorerName(chainId as ChainId)
  const explorerLink = getExplorerLink(chainId as ChainId, account as string, 'address')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const useBalance = async () => {
    const result = await balance
    return result
  }

  useEffect(() => {
    i18next.changeLanguage(selectedLanguage.toLowerCase())
  }, [selectedLanguage])

  // useBalance().then((result)=>console.log(result))

  const [transactionsHistoryModal] = useModal(<RecentTransactionsModal />)

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
