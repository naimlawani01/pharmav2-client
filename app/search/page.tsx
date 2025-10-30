import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-600">Chargement...</div>}>
      <SearchClient />
    </Suspense>
  );
}

export const dynamic = 'force-dynamic';
