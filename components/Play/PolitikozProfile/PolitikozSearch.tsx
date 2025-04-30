import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

interface Politikoz {
  name: string;
  type: string;
}

interface PolitikozSearchProps {
  politikozList: Politikoz[]; 
  onSelectPolitikoz: (name: string) => void;
}

export default function PolitikozSearch({ politikozList, onSelectPolitikoz }: PolitikozSearchProps) {
  const t = useTranslations("PolitikozProfile"); // 🟡 namespace usado
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Politikoz[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = politikozList
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, politikozList]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchTerm("");
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-[280px] md:w-[320px]" ref={searchRef}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="w-6 h-6" />
      </div>

      <input
        type="text"
        placeholder={t("searchPlaceholder")} // 🟡 placeholder traduzido
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 pl-10 border-2 border-white bg-black text-yellow-300 placeholder-gray-500 shadow-md focus:outline-none text-left rounded-md"
      />

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-gray-700 border-2 border-white shadow-lg z-50 max-h-60 overflow-y-auto rounded-md">
          {suggestions.map((p, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-600 cursor-pointer flex justify-start items-center pl-4"
              onClick={() => {
                onSelectPolitikoz(p.name);
                setSearchTerm("");
                setSuggestions([]);
              }}
            >
              <span className="font-semibold">{p.name}</span>
              <span className="ml-2 text-gray-300">({p.type})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
