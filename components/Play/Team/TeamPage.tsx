"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const teamMembers = [
  {
    name: "Joyce",
    image: "/images/assets/07705.png",
    role: "uxui",
    description: "uxuiDesc",
  },
  {
    name: "Thiago",
    image: "/images/assets/00244.png",
    role: "fullstack",
    description: "fullstackDesc",
  },
  {
    name: "Thulio",
    image: "/images/assets/01286.png",
    role: "infra",
    description: "infraDesc",
  },
];

export default function TeamPage() {
  const t = useTranslations("Team");

  return (
    <div className="w-full max-w-5xl mx-auto text-white p-6 space-y-6">
      <div className="bg-gray-900 border-4 border-yellow-500 rounded-lg p-6 shadow-lg space-y-2">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">{t("title")}</h2>
        <p className="text-sm text-gray-300 text-justify">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-gray-800 border-2 border-yellow-500 p-4 rounded-lg shadow-lg flex flex-col items-center text-center"
          >
            <Image
              src={member.image}
              alt={member.name}
              width={100}
              height={100}
              className="rounded-full mb-3"
            />
            <h4 className="text-lg font-bold text-yellow-300 mb-1">{member.name}</h4>
            <p className="text-sm text-green-400 font-semibold mb-1">{t(member.role)}</p>
            <p className="text-sm text-gray-300 text-justify">{t(member.description)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
