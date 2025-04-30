'use client';

import React from 'react';

export default function ConnectWalletListPlaceholder() {
  return (
    <div className="flex flex-col space-y-2">
      {Array.from({ length: 1 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center px-4 py-2 bg-gray-700 text-gray-500 border-2 border-gray-600 rounded-md animate-pulse"
          style={{
            fontFamily: '"Press Start 2P", cursive',
          }}
        >
          <div className="w-6 h-6 bg-gray-600 rounded-full mr-2"></div>
          <span className="flex-1 h-4 bg-gray-600 rounded-md"></span>
        </div>
      ))}
    </div>
  );
}
