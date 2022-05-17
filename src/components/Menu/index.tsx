import React, { lazy, useEffect, useState } from 'react'
import { useModal } from '@gravis.finance/uikit'
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
import menuLinks from './config'

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

  useEffect(() => {
    i18next.changeLanguage(selectedLanguage.toLowerCase())
  }, [selectedLanguage])

  // useBalance().then((result)=>console.log(result))

  const transactionsHistoryModalComponent = React.useMemo(() => <RecentTransactionsModal />, [])

  const [transactionsHistoryModal] = useModal(transactionsHistoryModalComponent)

  return (
    <UikitMenu
      isProduction={process.env.REACT_APP_NODE_ENV === 'production'}
      links={menuLinks}
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
      balanceHook={useBalance}
      setSelectedLanguage={setSelectedLanguage}
      {...props}
    />
  )
}

export default Menu
