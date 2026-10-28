import React, { useState, useEffect, useMemo } from 'react';
import {
  FinancialTransaction,
  FinancialSummary,
  FilterState,
  TransactionFormData,
} from './types/finance';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TransactionList } from './components/TransactionList';
import { TransactionForm } from './components/TransactionForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { ShieldCheck, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<FinancialTransaction | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    type: 'all',
    status: 'all',
    search: '',
    sortBy: 'dueDate_asc',
  });

  // Carregar dados do localStorage na montagem inicial
  useEffect(() => {
    const loaded = storageService.getTransactions();
    setTransactions(loaded);
  }, []);

  // Notificação temporária de feedback
  const showFeedback = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Cálculo de resumos consolidados
  const summary: FinancialSummary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;
    let pendingCount = 0;
    let completedCount = 0;

    for (const t of transactions) {
      if (t.type === 'income') {
        totalIncome += t.amount;
        incomeCount++;
      } else {
        totalExpense += t.amount;
        expenseCount++;
      }

      if (t.status === 'completed') {
        completedCount++;
      } else {
        pendingCount++;
      }
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      totalCount: transactions.length,
      incomeCount,
      expenseCount,
      pendingCount,
      completedCount,
    };
  }, [transactions]);

  // Filtragem e ordenação das transações
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((item) => {
        // Filtro por tipo (todas / entrada / saída)
        if (filterState.type !== 'all' && item.type !== filterState.type) {
          return false;
        }
        // Filtro por status (todos / pendente / concluído)
        if (filterState.status !== 'all' && item.status !== filterState.status) {
          return false;
        }
        // Busca textual
        if (filterState.search.trim() !== '') {
          const query = filterState.search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filterState.sortBy === 'dueDate_asc') {
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        }
        if (filterState.sortBy === 'dueDate_desc') {
          return (b.dueDate || '').localeCompare(a.dueDate || '');
        }
        if (filterState.sortBy === 'amount_desc') {
          return b.amount - a.amount;
        }
        if (filterState.sortBy === 'amount_asc') {
          return a.amount - b.amount;
        }
        if (filterState.sortBy === 'createdAt_desc') {
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
        return 0;
      });
  }, [transactions, filterState]);

  // Ações de criação e edição
  const handleFormSubmit = (data: TransactionFormData) => {
    if (editingTransaction) {
      // Atualizar transação existente
      const updatedTx: FinancialTransaction = {
        ...editingTransaction,
        ...data,
      };
      storageService.updateTransaction(updatedTx);
      setTransactions((prev) =>
        prev.map((t) => (t.id === updatedTx.id ? updatedTx : t))
      );
      showFeedback(`Lançamento "${updatedTx.title}" atualizado com sucesso!`);
    } else {
      // Cadastrar nova transação
      const newTx = storageService.addTransaction(data);
      setTransactions((prev) => [newTx, ...prev]);
      showFeedback(
        `${newTx.type === 'income' ? 'Entrada' : 'Saída'} "${newTx.title}" cadastrada!`
      );
    }
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleOpenCreateModal = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (tx: FinancialTransaction) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  // Ação de exclusão protegida por confirmação
  const handleDeleteRequest = (tx: FinancialTransaction) => {
    setDeletingTransaction(tx);
  };

  const handleConfirmDelete = () => {
    if (!deletingTransaction) return;
    const deletedTitle = deletingTransaction.title;
    storageService.deleteTransaction(deletingTransaction.id);
    setTransactions((prev) => prev.filter((t) => t.id !== deletingTransaction.id));
    setDeletingTransaction(null);
    showFeedback(`Lançamento "${deletedTitle}" excluído com sucesso.`);
  };

  const handleCancelDelete = () => {
    setDeletingTransaction(null);
  };

  // Alternância rápida de status
  const handleToggleStatus = (id: string) => {
    const updated = storageService.toggleStatus(id);
    if (updated) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
      showFeedback(
        `Status alterado para ${
          updated.status === 'completed'
            ? updated.type === 'income'
              ? 'Recebido'
              : 'Pago'
            : 'Pendente'
        }.`,
        'info'
      );
    }
  };

  // Restaurar dados de exemplo
  const handleRestoreSamples = () => {
    const samples = storageService.restoreSampleData();
    setTransactions(samples);
    showFeedback('Exemplos restaurados com sucesso!');
  };

  const handleFilterChange = (partial: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...partial }));
  };

  const handleResetFilters = () => {
    setFilterState({
      type: 'all',
      status: 'all',
      search: '',
      sortBy: 'dueDate_asc',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/80">
      {/* Top Bar Navigation */}
      <Header
        onNewTransactionClick={handleOpenCreateModal}
        onResetSamplesClick={handleRestoreSamples}
        totalTransactions={transactions.length}
      />

      {/* Notificação flutuante */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-stone-800">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Boas-Vindas e Acolhimento */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-stone-900 to-stone-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel de Equilíbrio Financeiro</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Controle simples de suas entradas e saídas
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Mantenha o controle dos seus lucros e despesas com prazos e status atualizados em tempo real.
              Tudo salvo automaticamente no seu navegador.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              + Adicionar Movimentação
            </button>
          </div>
        </div>

        {/* Cartões de Resumo e Métricas */}
        <SummaryCards summary={summary} />

        {/* Seção Principal de Listagem de Transações */}
        <section aria-label="Extrato de movimentações">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Movimentações Registradas
              </h2>
              <p className="text-xs text-stone-500">
                Acompanhe o detalhe de cada entrada ou saída, edite ou alterne o status
              </p>
            </div>
          </div>

          <TransactionList
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onEdit={handleOpenEditModal}
            onDeleteRequest={handleDeleteRequest}
            onToggleStatus={handleToggleStatus}
            onNewTransaction={handleOpenCreateModal}
            onRestoreSamples={handleRestoreSamples}
          />
        </section>
      </main>

      {/* Modal de Formulário (Criação e Edição) */}
      <TransactionForm
        isOpen={isFormOpen}
        initialData={editingTransaction}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseFormModal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={Boolean(deletingTransaction)}
        transaction={deletingTransaction}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Rodapé acolhedor e seguro */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Seus dados ficam 100% seguros e salvos no armazenamento local do seu navegador.</span>
          </div>
          <div>
            <span>Equilibra © {new Date().getFullYear()} · Simplicidade e saúde financeira</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
