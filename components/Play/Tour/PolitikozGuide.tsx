"use client";

import Image from "next/image";

interface PolitikozGuideProps {
  name: string;
}

export default function PolitikozGuide({ name }: PolitikozGuideProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="border-4 border-white bg-gray-700 shadow-[6px_6px_0px_black] w-[80px] h-[96px] sm:w-[100px] sm:h-[120px]">
        <Image 
          src={`/images/assets/${name.replace("#", "")}.png`} 
          alt={`Guide ${name}`} 
          width={100}
          height={120}
          className="w-full h-full object-cover image-render-pixelated"
        />
      </div>
    </div>
  );
}
