import React, { useEffect } from 'react';
import { FinancialTransaction } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { AlertCircle, Trash2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  transaction: FinancialTransaction | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  transaction,
  onConfirm,
  onCancel,
}) => {
  // Tratar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.type === 'income';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-5 top-5 p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-stone-900">
              Confirmar Exclusão
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Tem certeza de que deseja excluir permanentemente este lançamento?
            </p>
          </div>
        </div>

        {/* Card de resumo do item a ser excluído */}
        <div className="my-5 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
          <div className="flex items-center justify-between text-xs font-medium text-stone-500 mb-1">
            <span>{isIncome ? 'Entrada' : 'Saída'}</span>
            <span className="font-mono-numbers font-semibold text-stone-800">
              {formatCurrency(transaction.amount)}
            </span>
          </div>
          <p className="text-sm font-bold text-stone-900 truncate">
            {transaction.title}
          </p>
          {transaction.description && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-1">
              {transaction.description}
            </p>
          )}
        </div>

        <p className="text-xs text-stone-500 mb-6">
          Esta ação recalculará seus saldos imediatamente e não poderá ser desfeita.
        </p>

        {/* Botões */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar e Manter
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sim, Excluir Lançamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
