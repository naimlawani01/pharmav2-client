import axios, { AxiosInstance } from 'axios';
import type { ProduitDisponible, Produit } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Créer une instance axios avec configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== RECHERCHE ====================
export const rechercheApi = {
  searchProduit: async (
    nom: string,
    latitude?: number,
    longitude?: number
  ): Promise<ProduitDisponible[]> => {
    const params: any = { nom };
    if (latitude !== undefined && longitude !== undefined) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    try {
      const response = await apiClient.get('/api/recherche/produit', { params });
      return response.data;
    } catch (error: any) {
      // Si c'est une erreur 404 avec un message détaillé du backend, on la propage
      if (error.response?.status === 404 && error.response?.data?.detail) {
        throw error;
      }
      // Sinon, c'est probablement une erreur réseau ou endpoint non trouvé
      if (error.response?.status === 404) {
        throw new Error('Endpoint non trouvé. Vérifiez que le backend est bien lancé sur http://localhost:8000');
      }
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est bien lancé.');
      }
      throw error;
    }
  },
};

// ==================== PRODUITS ====================
export const produitsApi = {
  getAll: async (skip: number = 0, limit: number = 100): Promise<Produit[]> => {
    const response = await apiClient.get('/api/produits/', { params: { skip, limit } });
    return response.data;
  },
  
  search: async (query: string, limit: number = 10): Promise<Produit[]> => {
    const response = await apiClient.get('/api/produits/', { 
      params: { skip: 0, limit }
    });
    // Filtrer côté client pour l'instant (on pourrait créer un endpoint dédié au backend)
    const allProducts = response.data;
    return allProducts.filter((p: Produit) => 
      p.nom.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
  },
};

export default apiClient;
