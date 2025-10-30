'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Package, MapPin, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveSearchHistory } from '@/lib/utils';
import SearchAutocomplete from '@/components/SearchAutocomplete';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const router = useRouter();

  // Demander la géolocalisation au chargement
  useEffect(() => {
    if (navigator.geolocation) {
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
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Trouvez vos{' '}
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                médicaments
              </span>
              <br />
              en quelques clics
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Recherchez facilement vos produits pharmaceutiques et trouvez les pharmacies
              les plus proches de vous
            </p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="relative">
                <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 hover:border-primary-300 transition-all duration-300">
                  <div className="pl-6 pr-4 flex-shrink-0">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 relative">
                    <SearchAutocomplete
                      value={searchTerm}
                      onChange={setSearchTerm}
                      onSubmit={handleSearch}
                      showHistory={true}
                      placeholder="Recherchez un médicament (ex: Paracétamol, Aspirine...)"
                      className="w-full"
                      inputClassName="w-full px-4 py-4 md:py-6 text-base md:text-lg bg-transparent outline-none text-gray-900 placeholder:text-sm md:placeholder:text-base placeholder-gray-400 text-left"
                    />
                  </div>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSearch();
                    }}
                    disabled={!searchTerm.trim()}
                    className="mx-2 px-8 py-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 flex-shrink-0"
                  >
                    Rechercher
                  </button>
                </div>
                {latitude && longitude && (
                  <p className="mt-4 text-sm text-gray-600 flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-600" />
                    Géolocalisation activée - Résultats triés par distance
                  </p>
                )}
              </div>
            </motion.form>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-primary-300 transition-all"
          >
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Package className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Recherche rapide</h3>
            <p className="text-gray-600">
              Trouvez instantanément vos médicaments grâce à notre moteur de recherche performant
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-primary-300 transition-all"
          >
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Géolocalisation</h3>
            <p className="text-gray-600">
              Découvrez les pharmacies les plus proches de vous avec tri automatique par distance
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-primary-300 transition-all"
          >
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Données fiables</h3>
            <p className="text-gray-600">
              Accédez aux informations en temps réel sur les stocks et prix disponibles
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 PharmaSearch. Trouvez vos médicaments facilement.
          </p>
        </div>
      </footer>
    </div>
  );
}
