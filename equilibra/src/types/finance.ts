/**
 * Tipos e interfaces de domínio do sistema Equilibra
 */

export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'pending' | 'completed';

export interface FinancialTransaction {
  id: string;
  title: string;
  description: string;
  type: TransactionType;
  amount: number;
  dueDate: string; // formato YYYY-MM-DD
  status: TransactionStatus;
  createdAt: string; // ISO string
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  totalCount: number;
  incomeCount: number;
  expenseCount: number;
  pendingCount: number;
  completedCount: number;
}

export type FilterType = 'all' | 'income' | 'expense';
export type FilterStatus = 'all' | 'pending' | 'completed';
export type SortOption = 'dueDate_asc' | 'dueDate_desc' | 'amount_desc' | 'amount_asc' | 'createdAt_desc';

export interface FilterState {
  type: FilterType;
  status: FilterStatus;
  search: string;
  sortBy: SortOption;
}

export type TransactionFormData = Omit<FinancialTransaction, 'id' | 'createdAt'>;
