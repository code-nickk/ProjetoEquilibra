import { FinancialTransaction, TransactionFormData } from '../types/finance';

const STORAGE_KEY = 'equilibra_transacoes_v1';

/**
 * Exemplos iniciais amigáveis para novos usuários visualizarem o potencial do sistema
 */
const SAMPLE_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'sample-1',
    title: 'Consultoria de Design e Desenvolvimento',
    description: 'Pagamento da 2ª parcela do projeto para o cliente Alpha.',
    type: 'income',
    amount: 3850.00,
    dueDate: '2026-10-30',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Venda de Produtos Online',
    description: 'Faturamento consolidado da loja virtual no final de semana.',
    type: 'income',
    amount: 1420.50,
    dueDate: '2026-10-28',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Aluguel do Espaço de Trabalho',
    description: 'Mensalidade da sala comercial com taxa de condomínio.',
    type: 'expense',
    amount: 1650.00,
    dueDate: '2026-11-05',
    status: 'pending',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'sample-4',
    title: 'Serviços de Nuvem e Hospedagem',
    description: 'Assinatura dos servidores e serviços de banco de dados.',
    type: 'expense',
    amount: 240.00,
    dueDate: '2026-11-01',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-5',
    title: 'Rendimento de Aplicação CDB',
    description: 'Proventos automáticos da reserva de emergência.',
    type: 'income',
    amount: 310.25,
    dueDate: '2026-11-10',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
];

export const storageService = {
  /**
   * Obtém todas as transações salvas no localStorage
   */
  getTransactions(): FinancialTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Primeira visita: inicializa com dados amigáveis de exemplo
        this.saveTransactions(SAMPLE_TRANSACTIONS);
        return SAMPLE_TRANSACTIONS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler transações do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de transações no localStorage
   */
  saveTransactions(transactions: FinancialTransaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao salvar transações no localStorage:', error);
    }
  },

  /**
   * Adiciona uma nova transação
   */
  addTransaction(data: TransactionFormData): FinancialTransaction {
    const transactions = this.getTransactions();
    const newTransaction: FinancialTransaction = {
      ...data,
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
    };

    const updated = [newTransaction, ...transactions];
    this.saveTransactions(updated);
    return newTransaction;
  },

  /**
   * Atualiza uma transação existente
   */
  updateTransaction(transaction: FinancialTransaction): FinancialTransaction {
    const transactions = this.getTransactions();
    const updated = transactions.map((t) => (t.id === transaction.id ? transaction : t));
    this.saveTransactions(updated);
    return transaction;
  },

  /**
   * Exclui uma transação pelo ID
   */
  deleteTransaction(id: string): void {
    const transactions = this.getTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    this.saveTransactions(filtered);
  },

  /**
   * Alterna rapidamente o status entre pendente e concluído
   */
  toggleStatus(id: string): FinancialTransaction | null {
    const transactions = this.getTransactions();
    let updatedTx: FinancialTransaction | null = null;
    const updated = transactions.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        updatedTx = { ...t, status: nextStatus };
        return updatedTx;
      }
      return t;
    });
    if (updatedTx) {
      this.saveTransactions(updated);
    }
    return updatedTx;
  },

  /**
   * Restaura os dados de exemplo
   */
  restoreSampleData(): FinancialTransaction[] {
    this.saveTransactions(SAMPLE_TRANSACTIONS);
    return SAMPLE_TRANSACTIONS;
  },

  /**
   * Limpa todas as transações
   */
  clearAll(): void {
    this.saveTransactions([]);
  }
};
