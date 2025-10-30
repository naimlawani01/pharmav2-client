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

2. Configurer l'URL de l'API (optionnel) :
Créer un fichier `.env.local` :
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

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
│   │   └── page.tsx        # Page de résultats de recherche
│   └── globals.css         # Styles globaux
├── lib/
│   └── api.ts              # Client API
├── types/
│   └── index.ts            # Types TypeScript
└── ...
```

## 🔗 API Backend

Cette application nécessite le backend `pharmacy` qui doit être lancé sur `http://localhost:8000` (ou l'URL configurée).

Endpoints utilisés :
- `GET /api/recherche/produit?nom={nom}&latitude={lat}&longitude={lng}` - Recherche de produits
- `GET /api/produits/` - Liste des produits (optionnel)
