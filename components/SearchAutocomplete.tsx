'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { produitsApi } from '@/lib/api';
import { getSearchHistory, saveSearchHistory } from '@/lib/utils';
import type { Produit } from '@/types';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  showHistory?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  onSuggestionClick,
  showHistory = true,
  placeholder = "Rechercher...",
  className = "",
  inputClassName = "",
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Produit[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showHistory) {
      setHistory(getSearchHistory());
    }
  }, [showHistory]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      setShowSuggestions(true); // Afficher immédiatement pour montrer le loading
      try {
        const results = await produitsApi.search(value, 5);
        setSuggestions(results);
      } catch (error) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowSuggestions(false);
      }
    };

    // Utiliser click au lieu de mousedown pour une meilleure détection
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, []);

  const handleSuggestionClick = (text: string) => {
    onChange(text);
    setIsFocused(false);
    setShowSuggestions(false);
    if (onSuggestionClick) {
      onSuggestionClick(text);
    } else {
      onSubmit(text);
    }
    saveSearchHistory(text);
  };

  const handleHistoryClick = (term: string) => {
    handleSuggestionClick(term);
  };

  const hasActiveSuggestions = showSuggestions && (suggestions.length > 0 || loading);
  const displaySuggestions = hasActiveSuggestions && isFocused;
  const displayHistory = showHistory && isFocused && value.trim().length === 0 && history.length > 0 && !hasActiveSuggestions;
  
  const handleInputFocus = () => {
    setIsFocused(true);
    if (value.trim().length === 0 && history.length > 0) {
      // Afficher l'historique seulement si le champ est vide
      setShowSuggestions(false);
    } else if (value.trim().length >= 2) {
      // Afficher les suggestions si on a déjà du texte
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Utiliser un timeout pour permettre le clic sur les suggestions avant de fermer
    setTimeout(() => {
      // Vérifier si le focus n'est pas passé à un élément enfant du wrapper
      if (wrapperRef.current && !wrapperRef.current.contains(document.activeElement)) {
        setIsFocused(false);
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // Afficher l'historique si on efface tout le texte
    if (newValue.trim().length === 0 && history.length > 0 && isFocused) {
      setShowSuggestions(false);
    } else if (newValue.trim().length < 2) {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(value);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName || "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"}
      />
      <AnimatePresence>
        {(displaySuggestions || displayHistory) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] w-full mt-1 top-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-80 overflow-y-auto"
          >
            {displayHistory && (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recherches récentes
                  </div>
                </div>
                <div className="space-y-1">
                  {history.slice(0, 5).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistoryClick(term)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-sm text-gray-700"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="p-4 text-center text-sm text-gray-500">
                Recherche...
              </div>
            )}

            {displaySuggestions && !loading && suggestions.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  Suggestions
                </div>
                <div className="space-y-1">
                  {suggestions.map((produit) => (
                    <button
                      key={produit.id}
                      onClick={() => handleSuggestionClick(produit.nom)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-primary-600" />
                        <span className="text-sm text-gray-900">{produit.nom}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {displaySuggestions && !loading && suggestions.length === 0 && value.trim().length >= 2 && (
              <div className="p-4 text-center text-sm text-gray-500">
                Aucune suggestion trouvée
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
