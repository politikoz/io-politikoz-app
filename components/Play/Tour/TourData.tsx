import type { AppPath } from "@/i18n/routing";
import { ReactNode } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export interface TourStepData {
  message: string | ((t: (key: string) => string) => ReactNode);
  redirectTo?: AppPath;
  keepTourActive?: boolean;
}

export const tourSteps: Record<string, TourStepData[]> = {
  welcome: [
    { message: "tour.welcome.1" },
    { message: "tour.welcome.2" },
    { message: "tour.welcome.3", redirectTo: "/auth?origin=/office" },
  ],
  officeConnected: [
    { message: "tour.officeConnected.1" },
    { message: "tour.officeConnected.2" },
    { message: "tour.officeConnected.3", redirectTo: "/office?section=my-tickets" },
  ],
  officeNotConnected: [
    { message: "tour.officeNotConnected.1" },
    { message: "tour.officeNotConnected.2" },
    { message: "tour.officeNotConnected.3", redirectTo: "/office?section=my-tickets" },
  ],
  myTicketsConnected: [
    { message: "tour.myTicketsConnected.1" },
    { message: "tour.myTicketsConnected.2" },
    { message: "tour.myTicketsConnected.3" },
    { message: "tour.myTicketsConnected.4", redirectTo: "/office?section=buy-koz" },
  ],
  myTicketsNotConnected: [
    { message: "tour.myTicketsNotConnected.1" },
    { message: "tour.myTicketsNotConnected.2" },
    { message: "tour.myTicketsNotConnected.3", redirectTo: "/office?section=buy-koz" },
  ],
  buyKoz: [
    { message: "tour.buyKoz.1" },
    { message: "tour.buyKoz.2" },
    {
      message: (t) => (
        <span>
          {t("tour.buyKoz.3a")}&nbsp;
          <a
            href="https://discord.com/invite/BBFkgV4PYS"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400 hover:text-blue-200 inline-flex items-center"
          >
            {t("tour.buyKoz.3b")}
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 inline" aria-label="External link" />
          </a>
          &nbsp;{t("tour.buyKoz.3c")}
        </span>
      ),
    },
    { message: "tour.buyKoz.4", redirectTo: "/party" },
  ],
  createParty: [
    { message: "tour.createParty.1" },
    { message: "tour.createParty.2" },
    { message: "tour.createParty.3" },
    { message: "tour.createParty.4", redirectTo: "/party?section=my-politikoz" },
  ],
  myPolitikozConnected: [
    { message: "tour.myPolitikozConnected.1" },
    {
      message: (t) => (
        <span>
          {t("tour.myPolitikozConnected.2a")}&nbsp;
          <a
            href="https://www.jpg.store/collection/politikoz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-yellow-400 hover:text-yellow-300 font-bold inline-flex items-center"
          >
            {t("tour.myPolitikozConnected.2b")}
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 inline" aria-label="External link" />
          </a>
          &nbsp;{t("tour.myPolitikozConnected.2c")}
        </span>
      ),
      redirectTo: "/laundry?section=stake-plkoz",
    },
  ],
  myPolitikozNotConnected: [
    { message: "tour.myPolitikozNotConnected.1" },
    {
      message: (t) => (
        <span>
          {t("tour.myPolitikozNotConnected.2a")}&nbsp;
          <a
            href="https://www.jpg.store/collection/politikoz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-yellow-400 hover:text-yellow-300 font-bold inline-flex items-center"
          >
            {t("tour.myPolitikozNotConnected.2b")}
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 inline" aria-label="External link" />
          </a>
          &nbsp;{t("tour.myPolitikozNotConnected.2c")}
        </span>
      ),
      redirectTo: "/laundry?section=ticket-calculator",
    },
  ],
  stakePage: [
    { message: "tour.stakePage.1" },
    { message: "tour.stakePage.2" },
    {
      message: (t) => (
        <span>
          {t("tour.stakePage.3a")}
          <br />
          <a
            href="https://x.com/PolitikozNft"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400 hover:text-blue-200 font-bold inline-flex items-center"
          >
            {t("tour.stakePage.3b")}
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 inline" aria-label="External link" />
          </a>
        </span>
      ),
      keepTourActive: false,
    },
  ],
  ticketPolicyView: [
    { message: "tour.ticketPolicyView.1" },
    { message: "tour.ticketPolicyView.2" },
    { message: "tour.ticketPolicyView.3a" },
    { message: "tour.ticketPolicyView.3b" },
    {
      message: (t) => (
        <a
          href="https://x.com/PolitikozNft"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-400 hover:text-blue-200 font-bold inline-flex items-center"
        >
          {t("tour.ticketPolicyView.3c")}
          <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 inline" aria-label="External link" />
        </a>
      ),
      keepTourActive: false
    },
  ],
};
