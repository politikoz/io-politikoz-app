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
      message: "Ready? Connect your wallet and get some free tickets to start!",
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
    message: "This is where you can view all your tickets.",
  },
  {
    message: "By the way, you’ve just received some free tickets to get started!",
  },
  {
    message: "By default, all tickets are single use: they go to the next draw (except Frontman, saved for boosted Elections) and are then discarded.",
  },
  {
    message: "But you can change how your tickets are used at any time in Auto Link. Don't forget to configure it the way you prefer!", 
    redirectTo: "/office?section=buy-koz",
  },
],
myTicketsNotConnected: [
  {
    message: "This is where you can view all your tickets.",
  },
  {
    message: "By default, all tickets are single use: they go to the next draw (except Frontman, saved for boosted Elections) and are then discarded.",
  },
  {
    message: "But you can change how your tickets are used at any time in Auto Link. Don't forget to configure it the way you prefer!",     
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
    message: "Here you create a party and see all your politikoz.",
  },
  {
    message: "Parties let your politikoz join Elections and compete for big prizes.",
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
    message: "Plus, you'll get tickets to join our monthly draws for a chance to win even more ADA and boost your earnings.",
  },
  {
    message: (
      <span>
        Want to stay updated?{" "}
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
    message: "Plus, you'll get tickets to join our monthly lottery for a chance to win even more ADA and boost your earnings.",
  },
  {
    message: "Don't forget your welcome gift: get free tickets just by connecting your wallet!",
  },
  {
    message: (
      <span>
        Want to stay updated?{" "}
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
