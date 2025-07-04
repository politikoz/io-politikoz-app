'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ConnectWalletListPlaceholder from './ConnectWalletListPlaceholder';
import ConnectWalletList from './ConnectWalletList';

const DynamicMeshProvider = dynamic(
  () => import('@meshsdk/react').then((mod) => {
    console.log('[DynamicConnectWalletList] MeshProvider loaded');
    return mod.MeshProvider;
  }),
  { ssr: false, loading: () => <ConnectWalletListPlaceholder /> }
);

export default function DynamicConnectWalletList() {
  console.log('[DynamicConnectWalletList] Render');
  return (
    <DynamicMeshProvider>
      <ConnectWalletList />
    </DynamicMeshProvider>
  );
}
