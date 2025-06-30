import type { AppPath } from "@/i18n/routing";
import { ReactNode } from "react";

export interface TourStepData {
  message: string | ReactNode;
  redirectTo?: AppPath;
  keepTourActive?: boolean;
}

export const tourSteps: Record<string, TourStepData[]> = {
  welcome: [
    {
      message: "Hey, welcome to Politikoz! Here, you can join monthly draws with prizes starting from 350 ADA up to 28K ADA!",
    },
    {
      message: "Our draws are called Elections and all winning numbers come from the Cardano blockchain—so every draw is fair!",
    },       
    {
      message: "Let me show you around! Feel free to connect your wallet first and get some free tickets to start.",
      redirectTo: "/auth?origin=/office",      
    },
  ],  
  officeConnected: [
  { message: "This is your Office! Here you can buy KOZ and swap for tickets." },
  { message: "You can also see info about the current Election and prizes." },
  { message: "Let's check your brand new tickets now!",
    redirectTo: "/office?section=my-tickets"},
],
officeNotConnected: [
  { message: "This is your Office! Here you can buy KOZ and swap for tickets." },
  { message: "You can also see info about the current Election and prizes." },
  { message: "Let's check how it works now!",
    redirectTo: "/office?section=my-tickets"},
],
myTicketsConnected: [  
  {
    message: "You’ve just received some free tickets to get started!",
  },
  {
    message: "Every ticket can only be used once: after it enters a draw, it is discarded.",
  },
  {
    message: "By default, all your tickets (except Frontman, which is saved for boosted Elections) are set to be used 100% in the next Election.",
  },
  {
    message: "You can change this anytime in Auto Link—for example, you might choose to use only 50% of your LAUNDERER tickets in the next draw.", 
    redirectTo: "/office?section=buy-koz",
  },
],
myTicketsNotConnected: [  
   {
    message: "Every ticket can only be used once: after it enters a draw, it is discarded.",
  },
  {
    message: "By default, all your tickets (except Frontman, which is saved for boosted Elections) are set to be used 100% in the next Election.",
  },
  {
    message: "You can change this anytime in Auto Link—for example, you might choose to use only 50% of your LAUNDERER tickets in the next draw.",     
  },
    {
    message: "By the way, when you connect your wallet, you will receive a welcome gift with some free tickets to get started!",
    redirectTo: "/office?section=buy-koz",
  },
],
buyKoz: [
  {
    message: "Buy KOZ to swap for Frontman tickets and boost your chances in the next Election.",
  },
  {
    message: "Every KOZ you buy also helps fill the current Season faster.",
  },
    {
    message: "When a Season is filled, its BOOST prize goes to the Frontman jackpot, making the next Election even bigger and faster!",
  },
  {
    message: (
    <span>
      Don't have a Referral Code?{" "}
      <a
        href="https://discord.com/invite/BBFkgV4PYS"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-400 hover:text-blue-200"
      >
        Join our Discord
      </a>
      {" to ask for one and get free tickets when you buy KOZ."}
    </span>
  ),
  },
     {
    message: "The tour is almost over—keep going to see the last steps!",
    redirectTo: "/party",
  },
],
createParty: [
  {
    message: "Here you create a party and see all your Politikoz.",
  },
  {
    message: "Parties let your Politikoz join Elections and compete for big prizes.",
  },
  {
    message: "You'll also get a Referral Code.Share it and both get rewards when someone buys KOZ.",
  },
  {
    message: "Top 3 referrers win KOZ: 1st gets 14K, 2nd 7K, 3rd 3K.",
    redirectTo: "/party?section=my-politikoz",
  },
],
myPolitikozConnected: [
  {
    message: "Each Politikoz you own gives you 1 eternal ticket to be used in every Election for a chance to win ADA prizes.",
  },
  {
    message: (
      <span>
        Want some Politikoz?{" "}
        <a
          href="https://www.jpg.store/collection/politikoz"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-yellow-400 hover:text-yellow-300 font-bold"
        >
          Visit JPG Store
        </a>
        {" to get yours and boost your chances!"}
      </span>
    ),
    redirectTo: "/laundry?section=stake-plkoz",
  },
],
myPolitikozNotConnected: [
  {
    message: "Each Politikoz you own gives you 1 eternal ticket to be used in every Election for a chance to win ADA prizes.",
  },
  {
    message: (
      <span>
        Want some Politikoz?{" "}
        <a
          href="https://www.jpg.store/collection/politikoz"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-yellow-400 hover:text-yellow-300 font-bold"
        >
          Visit JPG Store
        </a>
        {" to get yours and boost your chances!"}
      </span>
    ),
    redirectTo: "/laundry?section=ticket-calculator",
  },
],
stakePage: [
  {
    message: "Stake your ADA with PLKOZ to earn ADA rewards just like any other pool.",
  },
  {
    message: "Plus, you'll get FREE tickets to join our Elections for a chance to win even more ADA and boost your earnings.",
  },
  {
    message: (
  <span>
    Want to stay updated and never miss free gifts?
    <br />
    <a
      href="https://x.com/PolitikozNft"
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-blue-400 hover:text-blue-200 font-bold"
    >
      Follow us on X!
    </a>
  </span>
),
    keepTourActive: false
  },
],
ticketPolicyView: [
  {
    message: "Stake your ADA with PLKOZ to earn ADA rewards just like any other pool.",
  },
  {
    message: "Plus, you'll get FREE tickets to join our Elections for a chance to win even more ADA and boost your earnings.",
  },
  {
    message: "Don't forget your welcome gift: get free tickets just by connecting your wallet!",
  },
  {
    message: (
  <span>
    Want to stay updated and never miss free gifts?
    <br />
    <a
      href="https://x.com/PolitikozNft"
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-blue-400 hover:text-blue-200 font-bold"
    >
      Follow us on X!
    </a>
  </span>
),
    keepTourActive: false
  },
],
};
