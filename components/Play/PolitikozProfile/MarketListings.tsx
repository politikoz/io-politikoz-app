import React from 'react';
import { useTranslations } from 'next-intl';
import { usePolitikozListings } from '@/hooks/usePolitikozListings';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

interface MarketListingsProps {
  cargo: string;
}

const formatPrice = (price: number) => `${price} ADA`;

export default function MarketListings({ cargo }: MarketListingsProps) {
  const t = useTranslations('PolitikozProfile.MarketListings');
  const { data: listings } = usePolitikozListings(cargo);

  if (!listings?.length) {
    return null;
  }

  return (
    <div className="w-full p-4">
      <h3 className="text-xl text-yellow-300 font-bold mb-4">{t('title')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <div 
            key={listing.name}
            className="bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600 hover:border-yellow-300 transition-colors"
          >
            <div className="aspect-square relative">
              <img
                src={listing.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
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
              <a
                href={`https://www.jpg.store/asset/${listing.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                {t('buyNow')}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}