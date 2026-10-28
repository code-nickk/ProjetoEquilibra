import React from 'react';
import { Scale, PlusCircle, RotateCcw, FilterX } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onNewTransaction: () => void;
  onClearFilters?: () => void;
  onRestoreSamples?: () => void;
  searchTerm?: string;
  typeFilter?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onNewTransaction,
  onClearFilters,
  onRestoreSamples,
  searchTerm,
  typeFilter,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-dashed border-stone-300 my-6">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto mb-4">
          <FilterX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-stone-900">
          Nenhuma movimentação encontrada
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
          {searchTerm
            ? `Nenhum resultado corresponde à busca "${searchTerm}". Tente outros termos ou ajuste os filtros.`
            : typeFilter === 'income'
            ? 'Você ainda não possui entradas correspondentes ao status selecionado.'
            : typeFilter === 'expense'
            ? 'Você ainda não possui saídas correspondentes ao status selecionado.'
            : 'Nenhum lançamento encontrado com a combinação atual de filtros.'}
        </p>

        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Filtros e Ver Todas</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200/90 shadow-xs my-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
        <Scale className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-stone-900">
        Seu livro de finanças está vazio
      </h3>
      <p className="text-xs text-stone-500 max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
        O <strong>Equilibra</strong> ajuda você a manter a clareza sobre o que entra e o que sai da sua conta.
        Comece registrando uma entrada de rendimento ou uma despesa com seu prazo de vencimento.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNewTransaction}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Primeiro Lançamento</span>
        </button>

        {onRestoreSamples && (
          <button
            type="button"
            onClick={onRestoreSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Carregar Dados de Exemplo</span>
          </button>
        )}
      </div>
    </div>
  );
};
