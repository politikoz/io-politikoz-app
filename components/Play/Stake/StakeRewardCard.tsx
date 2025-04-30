import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface StakeRewardCardProps {
  name: string;
  amount: number;
  image: string;
}

export default function StakeRewardCard({ name, amount, image }: StakeRewardCardProps) {
  const t = useTranslations('Stake');

  return (
    <div className="relative bg-gray-800 border-2 border-yellow-500 p-4 rounded-lg shadow-pixel-art hover:shadow-pixel-art-hover transition-all">
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-16 h-16">
          <Image
            src={image}
            alt={`${name} Ticket`}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center">
          <h3 className="text-yellow-400 font-bold">{name}</h3>
          <p className="text-2xl font-bold text-white">{amount}</p>
        </div>
      </div>
    </div>
  );
}