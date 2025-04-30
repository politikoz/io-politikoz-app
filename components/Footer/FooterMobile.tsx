import React from "react";
import FooterIcons from "./FooterIcons";
import FooterLinks from "./FooterLinks";
import FooterSupportButton from "./FooterSupportButton";
import FooterCopyright from "./FooterCopyright";

const FooterMobile: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white py-8 px-4 space-y-6">
      {/* Icons Section */}
      <FooterIcons />

      {/* Separator */}
      <div className="w-full h-px bg-gray-700"></div>

      {/* Links and Support Button Section */}
      <div className="flex items-center justify-between">
        {/* Links Section (Left-aligned) */}
        <FooterLinks />

        {/* Support Button (Right-aligned) */}
        <FooterSupportButton />
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-gray-700"></div>

      {/* Copyright Section */}
      <FooterCopyright />
    </div>
  );
};

export default FooterMobile;
