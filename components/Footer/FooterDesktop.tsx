import React from "react";
import FooterIcons from "./FooterIcons";
import FooterSupportButton from "./FooterSupportButton";
import FooterCopyright from "./FooterCopyright";

const FooterDesktop: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white py-8">
      {/* Top Section */}
      <div className="flex justify-between items-center px-6">
        {/* Icons Section (Left-aligned) */}
        <div className="flex-1">
          <FooterIcons />
        </div>
      </div>

      {/* Separator */}
      <div className="w-full border-t border-gray-700 my-6"></div>

      {/* Bottom Section */}
      <div className="relative flex items-center justify-center px-4">
        {/* Centered Copyright */}
        <FooterCopyright />

        {/* Support Button */}
        <div className="absolute right-4">
          <FooterSupportButton />
        </div>
      </div>
    </div>
  );
};

export default FooterDesktop;
