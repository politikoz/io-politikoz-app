'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import ConnectWalletListPlaceholder from './ConnectWalletListPlaceholder';
import ConnectWalletList from './ConnectWalletList';

const DynamicMeshProvider = dynamic(
  () => import('@meshsdk/react').then((mod) => mod.MeshProvider),
  { ssr: false, loading: () => <ConnectWalletListPlaceholder /> }
);

export default function DynamicConnectWalletList() {
  return (
    <DynamicMeshProvider>
      <ConnectWalletList />
    </DynamicMeshProvider>
  );
}
