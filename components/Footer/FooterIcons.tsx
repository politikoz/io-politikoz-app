import React from "react";
import { FaYoutube, FaGithub, FaTwitter, FaDiscord, FaBook } from "react-icons/fa";
import { useTranslations } from "next-intl";

const FooterIcons: React.FC = () => {
  const t = useTranslations("Footer");

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 items-center space-y-2 sm:space-y-0">
      {/* Text */}
      <span className="text-sm text-center sm:text-left">{t("joinCommunity")}</span>

      {/* Icons */}
      <div className="flex space-x-4">
        <a
          href="https://x.com/PolitikozNft"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-400 transition-colors"
          aria-label="Twitter"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-indigo-500 transition-colors"
          aria-label="Discord"
        >
          <FaDiscord size={24} />
        </a>
        <a
          href="https://www.youtube.com/@politikozcardano4175/featured"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-red-500 transition-colors"
          aria-label="YouTube"
        >
          <FaYoutube size={24} />
        </a>
        <a
          href="https://github.com/politikoz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-500 transition-colors"
          aria-label="GitHub"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://docs.politikoz.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-green-500 transition-colors"
          aria-label="GitBook"
        >
          <FaBook size={24} />
        </a>
      </div>
    </div>
  );
};

export default FooterIcons;
