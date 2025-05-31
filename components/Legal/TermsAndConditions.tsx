"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const TermsAndConditions: React.FC = () => {
  const t = useTranslations("Terms");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-pixel text-primary mb-8">
        {t("title")}
      </h1>

      <div className="space-y-8 text-gray-700">
        {/* Introduction */}
        <section>
          <h2 className="text-xl font-pixel mb-4">{t("sections.intro.title")}</h2>
          <p className="mb-4">{t("sections.intro.content")}</p>
        </section>

        {/* KOZ Token */}
        <section>
          <h2 className="text-xl font-pixel mb-4">{t("sections.token.title")}</h2>
          <p className="mb-4">{t("sections.token.content")}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("sections.token.points.utility")}</li>
            <li>{t("sections.token.points.governance")}</li>
            <li>{t("sections.token.points.rewards")}</li>
          </ul>
        </section>

        {/* Disclaimers */}
        <section>
          <h2 className="text-xl font-pixel mb-4">{t("sections.disclaimers.title")}</h2>
          <p className="mb-4">{t("sections.disclaimers.content")}</p>
        </section>

        {/* User Responsibilities */}
        <section>
          <h2 className="text-xl font-pixel mb-4">{t("sections.responsibilities.title")}</h2>
          <ul className="list-disc pl-6 space-y-2">
            {["compliance", "security", "conduct"].map((key) => (
              <li key={key}>{t(`sections.responsibilities.points.${key}`)}</li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-pixel mb-4">{t("sections.contact.title")}</h2>
          <p>{t("sections.contact.content")}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;