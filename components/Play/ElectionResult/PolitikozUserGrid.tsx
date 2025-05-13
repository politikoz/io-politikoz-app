"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { useUserGridView } from "@/hooks/useUserGridView";
import { GridPolitikoz } from "@/types/UserGridViewData";

const roleColors = [
  { name: 'President', color: '#6EAA5E' },
  { name: 'Governor', color: '#FFFBCC' },
  { name: 'Senator', color: '#977BD0' },
  { name: 'Federal Deputy', color: '#FF8281' },
  { name: 'State Deputy', color: '#FFD991' },
  { name: 'Mayor', color: '#DEB0F7' },
  { name: 'Minister', color: '#88CEFA' },
  { name: 'Councilor', color: '#C0C0C0' },
  { name: 'Frontman', color: '#C0C0C0' },
  { name: 'Corrupt', color: '#6EAA5E' },
  { name: 'Lobbyist', color: '#977BD0' },
  { name: 'Briber', color: '#88CEFA' },
  { name: 'Launderer', color: '#FFFBCC' }
] as const;

const getRoleColor = (role: string): string => {
  const foundRole = roleColors.find((r) => r.name === role);
  return foundRole ? foundRole.color : "#ffffff";
};

const getPlaceSuffix = (place: number): string => {
  if (place % 100 >= 11 && place % 100 <= 13) return `${place}th`;
  switch (place % 10) {
    case 1: return `${place}st`;
    case 2: return `${place}nd`;
    case 3: return `${place}rd`;
    default: return `${place}th`;
  }
};

export default function PolitikozUserGrid() {
  const t = useTranslations("ElectionResult");
  const { data, isLoading, error } = useUserGridView();

  // Get unique roles from all groups
  const getUniqueRoles = (data: any) => {
    if (!data) return new Set<string>();
    
    const allRoles = [
      ...data.winning.map((p: GridPolitikoz) => p.role),
      ...data.outOfStamina.map((p: GridPolitikoz) => p.role),
      ...data.losing.map((p: GridPolitikoz) => p.role)
    ];
    
    return new Set(allRoles);
  };

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{t("errorLoading")}</div>;
  }

  if (!data) {
    return <div className="text-white text-center">{t("noData")}</div>;
  }

  const uniqueRoles = getUniqueRoles(data);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl text-yellow-400 font-bold text-center mb-6">{t("politikozOverview")}</h2>

      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {roleColors
          .filter(role => uniqueRoles.has(role.name))
          .map((role) => (
            <div key={role.name} className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md" style={{ backgroundColor: role.color }}></div>
              <span className="text-white text-sm">{role.name}</span>
            </div>
          ))}
      </div>

      <div className="flex flex-col">
        <PolitikozGroup 
          title={t("groupWinning")} 
          politikoz={data.winning} 
          showEarnings={true} 
          outOfStamina={false} 
        />
        <PolitikozGroup 
          title={t("groupOutOfStamina")} 
          politikoz={data.outOfStamina} 
          showEarnings={true} 
          outOfStamina={true} 
        />
        <PolitikozGroup 
          title={t("groupLosing")} 
          politikoz={data.losing} 
          showEarnings={false} 
          outOfStamina={false} 
        />
      </div>
    </div>
  );
}

interface PolitikozGroupProps {
  title: string;
  politikoz: GridPolitikoz[];
  showEarnings: boolean;
  outOfStamina: boolean;
}

function PolitikozGroup({ title, politikoz, showEarnings, outOfStamina }: PolitikozGroupProps) {
  const t = useTranslations("ElectionResult");

  const formatEarnings = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const sortedPolitikoz = React.useMemo(() => {
    return [...politikoz].sort((a, b) => {
      const aIndex = roleColors.findIndex(r => r.name === a.role);
      const bIndex = roleColors.findIndex(r => r.name === b.role);
      
      // If role not found in roleColors, put it at the end
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      // If same role, maintain original order by place
      if (aIndex === bIndex) {
        return a.place - b.place;
      }
      
      return aIndex - bIndex;
    });
  }, [politikoz]);

  return (
    <div className="bg-gray-900 p-4 border border-gray-700 shadow-lg rounded-md">
      <h3 className="text-yellow-300 text-lg font-semibold text-center mb-4">{title}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sortedPolitikoz.length > 0 ? (
          sortedPolitikoz.map((p) => (
            <div
              key={p.name}
              className="relative flex flex-col items-center"
              style={{ backgroundColor: getRoleColor(p.role), color: "#000" }}
            >
              <div className="absolute top-0 left-0 text-sm font-bold bg-black text-white px-2 py-1 rounded-bl-md">
                {getPlaceSuffix(p.place)}
              </div>

              <img
                src={`/images/assets/${p.image}.png`}
                alt={p.name}
                className="w-16 h-16 rounded-md mb-1 mt-3"
              />

              <div className="text-center">
                <p className="font-bold">{p.name}</p>
                {showEarnings && (
                  <p className="text-sm font-semibold">
                    {formatEarnings(p.earnings)} ADA
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300 col-span-full">{t("noPoliticians")}</p>
        )}
      </div>
    </div>
  );
}
