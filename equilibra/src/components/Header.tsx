import React from 'react';
import { Scale, PlusCircle, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onNewTransactionClick: () => void;
  onResetSamplesClick: () => void;
  totalTransactions: number;
}

export const Header: React.FC<HeaderProps> = ({
  onNewTransactionClick,
  onResetSamplesClick,
  totalTransactions,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                equilibra
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                Finanças Pessoais
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Controle acolhedor e descomplicado de lucros, gastos e prazos
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onResetSamplesClick}
            title="Restaurar dados de exemplo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Restaurar Exemplos</span>
          </button>

          <button
            type="button"
            onClick={onNewTransactionClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>
    </header>
  );
};
