import React from 'react';
import { useTranslations } from 'next-intl';
import { usePolitikozListings } from '@/hooks/usePolitikozListings';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

interface MarketListingsProps {
  cargo: string;
}

const formatPrice = (price: number) => `${price} ADA`;
const formatAssetNumber = (name: string) => name.replace('Politikoz', '');

export default function MarketListings({ cargo }: MarketListingsProps) {
  const t = useTranslations('PolitikozProfile.MarketListings');
  const { data: listings, isLoading, error } = usePolitikozListings(cargo, 4); // Force 4 items

  if (!listings?.length) {
    return null;
  }

  // Take only the first 4 items
  const displayListings = listings.slice(0, 4);

  return (
    <div className="w-full p-4">
      <h3 className="text-xl text-yellow-300 font-bold mb-4">{t('title')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayListings.map((listing) => (
          <div 
            key={listing.name}
            className="bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600 hover:border-yellow-300 transition-colors"
          >
            <div className="aspect-square relative">
              <img
                src={`/images/assets/${formatAssetNumber(listing.name)}.png`}
                alt={listing.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <h4 className="text-sm font-bold text-white">{listing.name}</h4>
              <p className="text-sm text-yellow-300 font-bold mt-1">
                {formatPrice(listing.price)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{listing.market}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <a
          href={`https://www.jpg.store/collection/politikoz?tab=items&searchText=${cargo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors"
        >
          <ShoppingCartIcon className="w-5 h-5 mr-2" />
          {t('viewAllListings')}
        </a>
      </div>
    </div>
  );
}