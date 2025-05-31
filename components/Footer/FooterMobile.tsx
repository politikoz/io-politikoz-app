import React from "react";
import FooterIcons from "./FooterIcons";
import FooterSupportButton from "./FooterSupportButton";
import FooterCopyright from "./FooterCopyright";

const FooterMobile: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white py-8 px-4 space-y-6">
      {/* Icons Section */}
      <FooterIcons />

      {/* Separator */}
      <div className="w-full h-px bg-gray-700"></div>

      {/* Support Button and Copyright Section */}
      <div className="flex items-center justify-between">
        <FooterSupportButton />
        <FooterCopyright />
      </div>
    </div>
  );
};

export default FooterMobile;
