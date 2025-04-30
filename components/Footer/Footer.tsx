import React from "react";
import FooterMobile from "./FooterMobile";
import FooterDesktop from "./FooterDesktop";

const Footer: React.FC = () => {
  return (
    <footer>
      {/* Mobile Footer */}
      <div className="block sm:hidden">
        <FooterMobile />
      </div>

      {/* Desktop Footer */}
      <div className="hidden sm:block">
        <FooterDesktop />
      </div>
    </footer>
  );
};

export default Footer;
