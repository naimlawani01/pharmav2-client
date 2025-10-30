// Utilitaires pour le localStorage
export const getSearchHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
};

export const saveSearchHistory = (term: string): void => {
  if (typeof window === 'undefined') return;
  const history = getSearchHistory();
  // Retirer le terme s'il existe déjà et le remettre au début
  const filtered = history.filter((h) => h.toLowerCase() !== term.toLowerCase());
  const updated = [term, ...filtered].slice(0, 10); // Garder seulement les 10 derniers
  localStorage.setItem('searchHistory', JSON.stringify(updated));
};

export const clearSearchHistory = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('searchHistory');
};

// Debounce function pour optimiser les recherches
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
