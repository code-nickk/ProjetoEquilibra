import React, { useState, useEffect } from 'react';
import { FinancialTransaction, TransactionFormData, TransactionType, TransactionStatus } from '../types/finance';
import { ArrowUpRight, ArrowDownRight, Calendar, Tag, FileText, CheckCircle2, Clock, X, Sparkles } from 'lucide-react';

interface TransactionFormProps {
  initialData?: FinancialTransaction | null;
  onSubmit: (data: TransactionFormData) => void;
  onCancel?: () => void;
  isOpen: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isOpen,
}) => {
  const getTodayISO = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [type, setType] = useState<TransactionType>('income');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [dueDate, setDueDate] = useState(getTodayISO());
  const [status, setStatus] = useState<TransactionStatus>('pending');
  const [error, setError] = useState<string | null>(null);

  // Carregar dados para edição se fornecido
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setAmount(initialData.amount ? initialData.amount.toString() : '');
      setDueDate(initialData.dueDate || getTodayISO());
      setStatus(initialData.status);
      setError(null);
    } else {
      // Resetar formulário
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setType('income');
    setTitle('');
    setDescription('');
    setAmount('');
    setDueDate(getTodayISO());
    setStatus('pending');
    setError(null);
  };

  const handleShortcutDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setDueDate(`${y}-${m}-${d}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Por favor, informe um título ou identificação para esta movimentação.');
      return;
    }

    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Por favor, informe um valor monetário válido maior que zero.');
      return;
    }

    if (!dueDate) {
      setError('Por favor, defina a data de prazo ou vencimento.');
      return;
    }

    setError(null);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      type,
      amount: numericAmount,
      dueDate,
      status,
    });

    if (!initialData) {
      resetForm();
    }
  };

  if (!isOpen) return null;

  const isEditing = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header do formulário */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <h2 className="text-xl font-bold text-stone-900">
                {isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {isEditing
                ? 'Atualize os dados e confirme as alterações'
                : 'Preencha os dados da sua entrada ou saída'}
            </p>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Fechar formulário"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="font-semibold">Atenção:</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Alternância Tipo: Entrada vs. Saída */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Entrada (Lucro)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Saída (Gasto)</span>
              </button>
            </div>
          </div>

          {/* Título e Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Título / Identificação <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder={type === 'income' ? 'Ex.: Salário, Venda, Freelance' : 'Ex.: Aluguel, Supermercado, Luz'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-emerald-600 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Valor (R$) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 font-mono-numbers">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-emerald-600 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 font-mono-numbers font-medium transition-all"
                />
              </div>
            </div>
          </div>

          {/* Prazo (Vencimento / Recebimento) com atalhos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Prazo / Data Prevista <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <span>Atalhos:</span>
                <button
                  type="button"
                  onClick={() => handleShortcutDate(0)}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  Hoje
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleShortcutDate(1)}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  Amanhã
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleShortcutDate(7)}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  +7 dias
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-emerald-600 rounded-xl text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Status da Transação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'pending'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${status === 'pending' ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>Pendente / A vencer</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'completed'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${status === 'completed' ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{type === 'income' ? 'Recebido' : 'Pago / Concluído'}</span>
              </button>
            </div>
          </div>

          {/* Descrição opcional */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Descrição ou Observações <span className="text-stone-400 font-normal">(opcional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <textarea
                rows={2}
                placeholder="Detalhes adicionais, como forma de pagamento, parcelamento ou notas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-emerald-600 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isEditing ? (
                <span>Salvar Alterações</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cadastrar {type === 'income' ? 'Entrada' : 'Saída'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
