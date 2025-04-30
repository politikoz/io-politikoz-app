"use client";

export default function Card({ value }: { value: number }) {
  const displayValue = value === 1 ? "A" : value;

  return (
    <div className="w-16 h-24 md:w-20 md:h-28 
      bg-gradient-to-br from-white to-gray-100 
      border-[4px] border-black 
      rounded-sm 
      shadow-[inset_3px_3px_0_rgba(0,0,0,0.3)] 
      flex items-center justify-center 
      text-black font-mono text-2xl md:text-3xl font-extrabold 
      tracking-wide 
      select-none 
      drop-shadow-[2px_2px_0_#000] 
      transition-transform duration-200"
    >
      {displayValue}
    </div>
  );
}
