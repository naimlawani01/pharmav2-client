// Produit types
export interface Produit {
  id: number;
  nom: string;
  description?: string;
  categorie?: string;
  prix_unitaire: number;
}

// Pharmacie types
export interface Pharmacie {
  id: number;
  nom: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  telephone?: string;
}

// Stock types
export interface Stock {
  id: number;
  produit_id: number;
  pharmacie_id: number;
  quantite_disponible: number;
  prix?: number;
}

// ProduitDisponible (résultat de recherche)
export interface ProduitDisponible {
  produit_id: number;
  produit_nom: string;
  pharmacie_id: number;
  pharmacie_nom: string;
  pharmacie_adresse?: string;
  pharmacie_latitude?: number;
  pharmacie_longitude?: number;
  pharmacie_telephone?: string;
  quantite_disponible: number;
  prix?: number;
  distance_km?: number;
}
