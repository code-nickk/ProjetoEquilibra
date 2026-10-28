import React from 'react';
import { FinancialTransaction } from '../types/finance';
import { formatCurrency, analyzeDueDate } from '../utils/formatters';
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface TransactionCardProps {
  transaction: FinancialTransaction;
  onEdit: (transaction: FinancialTransaction) => void;
  onDeleteRequest: (transaction: FinancialTransaction) => void;
  onToggleStatus: (id: string) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDeleteRequest,
  onToggleStatus,
}) => {
  const isIncome = transaction.type === 'income';
  const isCompleted = transaction.status === 'completed';
  const dueInfo = analyzeDueDate(transaction.dueDate, transaction.status, transaction.type);

  return (
    <div
      className={`group relative bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'border-stone-200/90 bg-stone-50/30'
          : dueInfo.isOverdue
          ? 'border-rose-200/80 bg-rose-50/15'
          : dueInfo.isToday
          ? 'border-amber-200/80 bg-amber-50/15'
          : 'border-stone-200 hover:border-stone-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Lado Esquerdo: Identificação, Título, Descrição e Prazo */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Ícone de Tipo */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isIncome
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
            title={isIncome ? 'Entrada (Lucro/Receita)' : 'Saída (Gasto/Despesa)'}
          >
            {isIncome ? (
              <ArrowUpRight className="w-5 h-5" />
            ) : (
              <ArrowDownRight className="w-5 h-5" />
            )}
          </div>

          {/* Dados Textuais */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isIncome ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isIncome ? 'Entrada' : 'Saída'}
              </span>

              {/* Botão de Status Rápido */}
              <button
                type="button"
                onClick={() => onToggleStatus(transaction.id)}
                title="Clique para alternar o status"
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{isIncome ? 'Recebido' : 'Pago'}</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Pendente</span>
                  </>
                )}
              </button>
            </div>

            <h3 className="text-base font-semibold text-stone-900 mt-1 truncate">
              {transaction.title}
            </h3>

            {transaction.description && (
              <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                {transaction.description}
              </p>
            )}

            {/* Prazo e Data */}
            <div className="flex items-center gap-2 text-xs mt-3 flex-wrap">
              <div
                className={`inline-flex items-center gap-1.5 font-medium ${
                  dueInfo.isOverdue
                    ? 'text-rose-700'
                    : dueInfo.isToday
                    ? 'text-amber-800'
                    : 'text-stone-600'
                }`}
              >
                {dueInfo.isOverdue ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{dueInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Valor e Ações */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
          <div className="text-left sm:text-right">
            <span
              className={`text-lg sm:text-xl font-bold font-mono-numbers tracking-tight block ${
                isIncome ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
            </span>
            <span className="text-xs text-stone-400 block sm:mt-0.5">
              {isCompleted ? 'Liquidado' : 'Aguardando'}
            </span>
          </div>

          {/* Botões de Ação (Editar e Excluir) */}
          <div className="flex items-center gap-1 sm:mt-2">
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              title="Editar esta movimentação"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              <span className="sr-only">Editar</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteRequest(transaction)}
              title="Excluir esta movimentação"
              className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
