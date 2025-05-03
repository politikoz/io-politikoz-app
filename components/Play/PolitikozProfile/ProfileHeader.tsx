import Image from "next/image";
import LuckyNumber from "./LuckyNumber";
import ReleasePrisonerButton from "./ReleasePrisonerButton";
import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  name?: string; // Make name optional
  type: string;
  stamina: number;
  luckyNumber: string;
  imprisoned: boolean;
  handleLuckyChange?: (newLucky: number) => void;
  onRelease?: (releaseAll: boolean) => void;
  prisonEpochs: number;
  releaseCost: number;
  totalImprisoned: number;
}

const getImagePath = (name: string | undefined) => {
  if (!name) return '/images/assets/default.png'; // Add a default image path
  const id = name.replace(/\D/g, '');
  return `/images/assets/${id}.png`;
};

export default function ProfileHeader({
  name,
  type,
  stamina,
  luckyNumber,
  imprisoned = false,
  handleLuckyChange,
  onRelease,
  prisonEpochs,
  releaseCost,
  totalImprisoned
}: ProfileHeaderProps) {
  const t = useTranslations("PolitikozProfile");

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex space-x-4">
        <div className="relative w-[100px] h-[120px] border-4 border-white bg-gray-600 shadow-[6px_6px_0px_black] overflow-hidden">
          <Image
            src={getImagePath(name)}
            alt={`Picture of ${name}`}
            width={90}
            height={120}
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
          {imprisoned && (
            <div className="absolute inset-0 flex justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[4px] h-full bg-black"></div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold font-['Press_Start_2P']">{type}</h2>
            <p className="font-['Press_Start_2P'] text-yellow-300 inline-block">
              {name}
              <span className="text-green-400">{luckyNumber}</span>
            </p>

            {!imprisoned && (
              <LuckyNumber value={luckyNumber} readonly={false} onChange={handleLuckyChange} />
            )}
          </div>

          {!imprisoned ? (
            <div className="flex flex-col items-start mt-2">
              <div className="w-[130px] h-5 border-4 border-white bg-gray-500 shadow-[4px_4px_0px_black] relative">
                <div
                  className="h-full bg-red-600 shadow-[2px_2px_0px_black]"
                  style={{ width: `${stamina}%` }}
                />
              </div>
              <span className="text-[9px] text-gray-300 font-['Press_Start_2P'] mt-1">
                {t("stamina")} {stamina}/100
              </span>
            </div>
          ) : (
            <div className="absolute flex mt-20">
              <ReleasePrisonerButton
                prisonerName={name ?? 'Unknown'}
                onRelease={onRelease || (() => {})}
                releaseCost={releaseCost}
                prisonEpochs={prisonEpochs}
                totalImprisoned={totalImprisoned}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
