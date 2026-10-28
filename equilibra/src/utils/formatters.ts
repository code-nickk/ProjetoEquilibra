/**
 * Funções de formatação amigável para moeda, datas e prazos no padrão pt-BR
 */

export function formatCurrency(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return 'Sem prazo';
  // dateStr geralmente vem no formato YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

export interface DueDateStatus {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
  isUpcoming: boolean;
  formattedDate: string;
}

export function analyzeDueDate(dateStr: string, status: 'pending' | 'completed', type: 'income' | 'expense'): DueDateStatus {
  const formattedDate = formatDateBR(dateStr);

  if (!dateStr) {
    return {
      label: 'Sem data definida',
      isOverdue: false,
      isToday: false,
      isUpcoming: false,
      formattedDate: '—',
    };
  }

  // Se já está concluído/pago
  if (status === 'completed') {
    return {
      label: type === 'income' ? `Recebido (${formattedDate})` : `Pago (${formattedDate})`,
      isOverdue: false,
      isToday: false,
      isUpcoming: false,
      formattedDate,
    };
  }

  // Comparar com a data atual (sem hora)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return {
      label: type === 'income' ? 'Previsto para hoje' : 'Vence hoje',
      isOverdue: false,
      isToday: true,
      isUpcoming: false,
      formattedDate,
    };
  }

  if (diffDays === 1) {
    return {
      label: type === 'income' ? 'Previsto para amanhã' : 'Vence amanhã',
      isOverdue: false,
      isToday: false,
      isUpcoming: true,
      formattedDate,
    };
  }

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    const dayLabel = daysAgo === 1 ? '1 dia' : `${daysAgo} dias`;
    return {
      label: type === 'income' ? `Atrasado há ${dayLabel}` : `Vencida há ${dayLabel}`,
      isOverdue: true,
      isToday: false,
      isUpcoming: false,
      formattedDate,
    };
  }

  if (diffDays <= 7) {
    return {
      label: `Vence em ${diffDays} dias (${formattedDate})`,
      isOverdue: false,
      isToday: false,
      isUpcoming: true,
      formattedDate,
    };
  }

  return {
    label: `Prazo: ${formattedDate}`,
    isOverdue: false,
    isToday: false,
    isUpcoming: false,
    formattedDate,
  };
}
