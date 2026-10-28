import React from 'react';
import { FinancialSummary } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, Clock, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  summary: FinancialSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const isPositiveBalance = summary.balance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Saldo Líquido Atual */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Saldo em Caixa
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isPositiveBalance
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col">
          <span
            className={`text-2xl font-bold font-mono-numbers tracking-tight ${
              isPositiveBalance ? 'text-stone-900' : 'text-rose-600'
            }`}
          >
            {formatCurrency(summary.balance)}
          </span>
          <span className="text-xs text-stone-500 mt-1">
            {summary.totalCount === 0
              ? 'Nenhum lançamento no período'
              : `${summary.totalCount} ${
                  summary.totalCount === 1 ? 'registro total' : 'registros totais'
                }`}
          </span>
        </div>
      </div>

      {/* Total de Entradas / Lucros */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-emerald-200 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Entradas (Lucros)
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-mono-numbers tracking-tight text-emerald-700">
            +{formatCurrency(summary.totalIncome)}
          </span>
          <span className="text-xs text-stone-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-emerald-700 font-semibold">{summary.incomeCount}</span>
            <span>{summary.incomeCount === 1 ? 'entrada cadastrada' : 'entradas cadastradas'}</span>
          </span>
        </div>
      </div>

      {/* Total de Saídas / Gastos */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-rose-200 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
            Saídas (Gastos)
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-mono-numbers tracking-tight text-rose-700">
            -{formatCurrency(summary.totalExpense)}
          </span>
          <span className="text-xs text-stone-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-rose-700 font-semibold">{summary.expenseCount}</span>
            <span>{summary.expenseCount === 1 ? 'saída cadastrada' : 'saídas cadastradas'}</span>
          </span>
        </div>
      </div>

      {/* Status das Contas e Prazos */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-amber-200 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Prazos & Liquidação
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>
                <strong>{summary.pendingCount}</strong> pendentes
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
              <span>
                <strong>{summary.completedCount}</strong> liquidados
              </span>
            </div>
          </div>
          <span className="text-xs text-stone-400 mt-2">
            Acompanhe o vencimento de cada compromisso
          </span>
        </div>
      </div>
    </div>
  );
};
