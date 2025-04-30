import React from "react";
import { Link } from "@/i18n/routing";

type NavigationProps = {
  home: string;
  explore: string;
  documentation: string;
  play: string;
};

export const Navigation: React.FC<NavigationProps> = ({ home, explore, play, documentation }) => {
  return (
    <nav className="flex space-x-8 text-sm font-pixel">
      {/* Link para Home */}
      <Link
        href="/"
        className="hover:text-primary transition-colors"
      >
        {home}
      </Link>

      {/* Link para Explore */}
      <Link
        href="/explore"
        className="hover:text-primary transition-colors"
      >
        {explore}
      </Link>

      {/* Link para play */}
      <Link
        href="/play"
        className="hover:text-primary transition-colors"
      >
        {play}
      </Link>

      {/* Link para Docs */}
      <a
        href="https://docs.politikoz.io"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary transition-colors"
      >
        {documentation}
      </a>
    </nav>
  );
};

export default Navigation;
