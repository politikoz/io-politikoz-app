import React from "react";
import { useTranslations } from "next-intl";

const FooterCopyright: React.FC = () => {
  const t = useTranslations("Footer");

  return (
    <p className="text-xs sm:text-sm text-gray-400 text-center">
      {t("copyright", { year: new Date().getFullYear() })}
    </p>
  );
};

export default FooterCopyright;
