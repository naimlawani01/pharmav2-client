# PharmaSearch - Frontend Client

Application web moderne pour rechercher des produits pharmaceutiques et trouver les pharmacies les plus proches.

## 🚀 Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles modernes et responsives
- **Framer Motion** - Animations fluides
- **Axios** - Client HTTP pour l'API
- **Lucide React** - Icônes modernes

## 📋 Prérequis

- Node.js 18+ et npm/yarn

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer l'URL de l'API (obligatoire) :
Créez un fichier `.env.local` à la racine du projet avec :
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Adaptez la valeur pour votre environnement (Vercel, etc.). Un exemple est disponible dans `.env.example`.

3. Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🎨 Fonctionnalités

- ✅ Recherche de produits par nom
- ✅ Affichage des pharmacies où le produit est disponible
- ✅ Géolocalisation automatique pour trier par distance
- ✅ Informations détaillées : prix, stock, adresse, téléphone
- ✅ Lien direct vers Google Maps pour l'itinéraire
- ✅ Design moderne et responsive
- ✅ Animations fluides

## 📁 Structure

```
pharmacy_front_client/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── search/
│   │   ├── page.tsx        # Wrapper serveur + Suspense
│   │   └── SearchClient.tsx# Composant client (hooks)
│   └── globals.css         # Styles globaux
├── lib/
│   └── api.ts              # Client API (NEXT_PUBLIC_API_URL requis)
├── types/
│   └── index.ts            # Types TypeScript
└── ...
```

## 🔗 API Backend

Cette application nécessite le backend `pharmacy` (FastAPI) lancé sur l'URL configurée via `NEXT_PUBLIC_API_URL`.

Endpoints utilisés :
- `GET /api/recherche/produit?nom={nom}&latitude={lat}&longitude={lng}` - Recherche de produits
- `GET /api/produits/` - Liste des produits (optionnel)
