import React from 'react';
import { FinancialTransaction, FilterState } from '../types/finance';
import { TransactionCard } from './TransactionCard';
import { EmptyState } from './EmptyState';
import { Search, ArrowUpDown, Filter } from 'lucide-react';

interface TransactionListProps {
  transactions: FinancialTransaction[];
  filteredTransactions: FinancialTransaction[];
  filterState: FilterState;
  onFilterChange: (newState: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onEdit: (transaction: FinancialTransaction) => void;
  onDeleteRequest: (transaction: FinancialTransaction) => void;
  onToggleStatus: (id: string) => void;
  onNewTransaction: () => void;
  onRestoreSamples: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  filteredTransactions,
  filterState,
  onFilterChange,
  onResetFilters,
  onEdit,
  onDeleteRequest,
  onToggleStatus,
  onNewTransaction,
  onRestoreSamples,
}) => {
  const isFiltered =
    filterState.type !== 'all' ||
    filterState.status !== 'all' ||
    filterState.search.trim() !== '';

  const totalAll = transactions.length;
  const countIncomes = transactions.filter((t) => t.type === 'income').length;
  const countExpenses = transactions.filter((t) => t.type === 'expense').length;

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Busca por texto */}
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={filterState.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-50 hover:bg-stone-100/60 focus:bg-white border border-stone-200 focus:border-emerald-600 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-stone-900 placeholder:text-stone-400 transition-all"
          />
        </div>

        {/* Controles de Filtros e Ordenação */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented Control de Tipo */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'all' })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterState.type === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todas ({totalAll})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'income' })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterState.type === 'income'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Entradas ({countIncomes})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'expense' })}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterState.type === 'expense'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Saídas ({countExpenses})
            </button>
          </div>

          {/* Filtro de Status */}
          <div className="relative">
            <select
              value={filterState.status}
              onChange={(e) =>
                onFilterChange({ status: e.target.value as FilterState['status'] })
              }
              className="pl-3 pr-8 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200/70 border-0 rounded-xl text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none"
            >
              <option value="all">Status: Todos</option>
              <option value="pending">Apenas Pendentes</option>
              <option value="completed">Apenas Concluídos</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          </div>

          {/* Ordenação */}
          <div className="relative">
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
              }
              className="pl-3 pr-8 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200/70 border-0 rounded-xl text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none"
            >
              <option value="dueDate_asc">Prazo: Mais próximo primeiro</option>
              <option value="dueDate_desc">Prazo: Mais distante primeiro</option>
              <option value="amount_desc">Valor: Maior valor primeiro</option>
              <option value="amount_asc">Valor: Menor valor primeiro</option>
              <option value="createdAt_desc">Data de Cadastro: Mais recentes</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Indicador de Quantidade */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Exibindo <strong>{filteredTransactions.length}</strong> de{' '}
          <strong>{totalAll}</strong> {totalAll === 1 ? 'movimentação' : 'movimentações'}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-emerald-700 hover:underline font-medium cursor-pointer"
          >
            Limpar filtros ativos
          </button>
        )}
      </div>

      {/* Lista de Cartões ou Estado Vazio */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          isFiltered={isFiltered}
          searchTerm={filterState.search}
          typeFilter={filterState.type}
          onNewTransaction={onNewTransaction}
          onClearFilters={onResetFilters}
          onRestoreSamples={onRestoreSamples}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
