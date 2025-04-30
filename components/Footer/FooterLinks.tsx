import React from "react";
import Link from "next/link"; // Importação do Link
import { useTranslations } from "next-intl";

const FooterLinks: React.FC = () => {
  const t = useTranslations("Footer.links");

  return (
    <div className="grid grid-cols-2 text-[10px] sm:grid-cols-[max-content_max-content] gap-x-10 gap-y-0.5  text-gray-400 whitespace-nowrap">
      <Link href="/terms" className="hover:text-primary transition-colors">
        {t("terms")}
      </Link>
      <Link href="/privacy" className="hover:text-primary transition-colors">
        {t("privacy")}
      </Link>
    </div>
  );
};

export default FooterLinks;