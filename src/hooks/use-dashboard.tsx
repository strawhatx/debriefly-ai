
import { create } from 'zustand'
import { EditingAccount } from '@/types/trading'

interface DashboardState {
  editingAccount?: EditingAccount
  setEditingAccount: (account?: EditingAccount) => void
  refetchAccounts: () => void
}

export const useDashboard = create<DashboardState>((set) => ({
  editingAccount: undefined,
  setEditingAccount: (account) => set({ editingAccount: account }),
  refetchAccounts: () => {
    // This would typically trigger a refetch of accounts
    console.log('Refetching accounts...')
  },
}))
