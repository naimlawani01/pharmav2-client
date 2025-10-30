'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { rechercheApi } from '@/lib/api';
import type { ProduitDisponible } from '@/types';
import { Search, MapPin, Package, Building2, Phone, ArrowLeft, Navigation, Loader2, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { saveSearchHistory } from '@/lib/utils';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<ProduitDisponible[]>([]);
  const [filteredResults, setFilteredResults] = useState<ProduitDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<'distance' | 'price-asc' | 'price-desc' | 'stock'>('distance');
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Récupérer les coordonnées depuis l'URL ou demander la géolocalisation
  useEffect(() => {
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    
    if (latParam && lngParam) {
      setLatitude(parseFloat(latParam));
      setLongitude(parseFloat(lngParam));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        () => {
          console.log('Géolocalisation refusée');
        }
      );
    }

    // Lancer la recherche si un terme est présent
    const query = searchParams.get('q');
    if (query) {
      performSearch(query, latParam ? parseFloat(latParam) : undefined, lngParam ? parseFloat(lngParam) : undefined);
    }
  }, [searchParams]);

  const performSearch = async (term: string, lat?: number, lng?: number) => {
    if (!term.trim()) return;

    setLoading(true);
    setError('');
    setSearchTerm(term);

    try {
      const data = await rechercheApi.searchProduit(term, lat || latitude, lng || longitude);
      setResults(data);
      setFilteredResults(data);
    } catch (err: any) {
      // Gérer les différents types d'erreurs
      let errorMessage = 'Erreur lors de la recherche';
      
      if (err.response?.data?.detail) {
        // Erreur du backend avec message détaillé (ex: "Aucun produit trouvé")
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        // Erreur personnalisée (ex: connexion refusée)
        errorMessage = err.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Endpoint non trouvé. Vérifiez que le backend est bien configuré.';
      }
      
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term?: string) => {
    const finalTerm = term || searchTerm;
    if (!finalTerm.trim()) return;

    saveSearchHistory(finalTerm.trim());
    const params = new URLSearchParams({ q: finalTerm.trim() });
    if (latitude && longitude) {
      params.append('lat', latitude.toString());
      params.append('lng', longitude.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleBack = () => {
    router.push('/');
  };

  // Fonction de tri et filtrage
  useEffect(() => {
    let filtered = [...results];

    // Appliquer les filtres
    if (maxDistance !== null && maxDistance > 0) {
      filtered = filtered.filter(r => {
        if (r.distance_km === undefined || r.distance_km === null) return false;
        return r.distance_km <= maxDistance;
      });
    }
    if (maxPrice !== null && maxPrice > 0) {
      filtered = filtered.filter(r => {
        if (r.prix === undefined || r.prix === null) return false;
        return r.prix <= maxPrice;
      });
    }

    // Appliquer le tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          const distA = a.distance_km ?? Infinity;
          const distB = b.distance_km ?? Infinity;
          return distA - distB;
        case 'price-asc':
          const priceA = a.prix ?? Infinity;
          const priceB = b.prix ?? Infinity;
          return priceA - priceB;
        case 'price-desc':
          const priceADesc = a.prix ?? -Infinity;
          const priceBDesc = b.prix ?? -Infinity;
          return priceBDesc - priceADesc;
        case 'stock':
          return b.quantite_disponible - a.quantite_disponible;
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  }, [results, sortBy, maxDistance, maxPrice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Recherche</h1>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <SearchAutocomplete
                value={searchTerm}
                onChange={setSearchTerm}
                onSubmit={handleSearch}
                showHistory={true}
                placeholder="Rechercher un médicament..."
                className="w-full relative"
                inputClassName="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Rechercher'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Header avec filtres et tri */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
                  {filteredResults.length !== results.length && (
                    <span className="text-lg font-normal text-gray-500 ml-2">
                      (sur {results.length})
                    </span>
                  )}
                </h2>
                
                {/* Contrôles de tri et filtres */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Tri */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="distance">Distance</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="stock">Stock</option>
                    </select>
                  </div>

                  {/* Filtre distance */}
                  {latitude && longitude && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <input
                        type="number"
                        placeholder="Max km"
                        min="0"
                        step="0.1"
                        value={maxDistance !== null ? maxDistance : ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMaxDistance(val === '' || val === '0' ? null : parseFloat(val));
                        }}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white placeholder:text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Filtre prix */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">€</span>
                    <input
                      type="number"
                      placeholder="Prix max"
                      min="0"
                      step="0.01"
                      value={maxPrice !== null ? maxPrice : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMaxPrice(val === '' || val === '0' ? null : parseFloat(val));
                      }}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white placeholder:text-xs placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Reset filtres */}
                  {(maxDistance !== null || maxPrice !== null) && (
                    <button
                      onClick={() => {
                        setMaxDistance(null);
                        setMaxPrice(null);
                      }}
                      className="px-3 py-2 text-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={`${result.pharmacie_id}-${result.produit_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100"
                >
                  {/* Produit Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-xl">
                        <Package className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {result.produit_nom}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4 text-primary-600" />
                          <span className="font-medium">{result.pharmacie_nom}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary-600">
                        {result.prix?.toFixed(2) || 'N/A'}
                      </span>
                      <span className="text-gray-500">€</span>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-3">
                    {result.pharmacie_adresse && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span>{result.pharmacie_adresse}</span>
                      </div>
                    )}

                    {result.pharmacie_telephone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-primary-600" />
                        <a
                          href={`tel:${result.pharmacie_telephone}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {result.pharmacie_telephone}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        Stock: <span className="font-semibold text-gray-900">{result.quantite_disponible}</span> unité{result.quantite_disponible > 1 ? 's' : ''}
                      </span>
                      {result.distance_km && (
                        <div className="flex items-center gap-1 text-sm font-semibold text-primary-600">
                          <Navigation className="w-4 h-4" />
                          <span>{result.distance_km.toFixed(1)} km</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {result.pharmacie_latitude && result.pharmacie_longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${result.pharmacie_latitude},${result.pharmacie_longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all"
                    >
                      <Navigation className="w-4 h-4" />
                      Itinéraire
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && searchTerm && filteredResults.length === 0 && results.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Aucun résultat trouvé</p>
            <p className="text-gray-500">Essayez avec un autre terme de recherche</p>
          </motion.div>
        )}

        {!loading && results.length > 0 && filteredResults.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Aucun résultat ne correspond aux filtres</p>
            <button
              onClick={() => {
                setMaxDistance(null);
                setMaxPrice(null);
              }}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}

        {!loading && !searchTerm && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">Commencez votre recherche</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
