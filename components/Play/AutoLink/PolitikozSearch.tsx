"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface PolitikozSearchProps {
  onSelectPolitikoz: (id: string) => void;
}

export default function PolitikozSearch({ onSelectPolitikoz }: PolitikozSearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      // Filter numbers that contain the search term
      const filteredSuggestions: string[] = [];
      for (let i = 1; i <= 10000; i++) {
        const paddedNumber = i.toString().padStart(5, '0');
        if (paddedNumber.includes(searchTerm) && filteredSuggestions.length < 5) {
          filteredSuggestions.push(i.toString());
        }
      }
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    setSearchTerm(value);
  };

  return (
    <div className="relative w-[280px] md:w-[320px]" ref={searchRef}>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="w-6 h-6" />
      </div>

      <input
        type="text"
        placeholder="Search Politikoz (1-10000)..."
        value={searchTerm}
        onChange={handleChange}
        className="w-full p-2 pl-10 border-2 border-white bg-black text-yellow-300 placeholder-gray-500 shadow-md focus:outline-none text-left rounded-md"
      />

      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-gray-700 border-2 border-white shadow-lg z-50 max-h-60 overflow-y-auto rounded-md">
          {suggestions.map((id) => (
            <li
              key={id}
              className="p-2 hover:bg-gray-600 cursor-pointer flex justify-start items-center pl-4"
              onClick={() => {
                onSelectPolitikoz(id);
                setSearchTerm("");
                setSuggestions([]);
              }}
            >
              <span className="font-semibold">#{id.padStart(5, '0')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
