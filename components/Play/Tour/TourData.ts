import type { AppPath } from "@/i18n/routing";

export interface TourStepData {
  message: string;
  redirectTo?: AppPath;
}

export const tourSteps: Record<string, TourStepData[]> = {
  welcome: [
    {
      message: "Welcome to Politikoz! Our community shares a treasury filled with ADA.",
    },
    {
      message: "Every month, we run exclusive draws that reward active members with ADA.",
    },
    {
      message: "You can participate and increase your chances in many ways!",
    },
    {
      message: "Let’s take a quick look at our world...",
      redirectTo: "/party", // ✅ já é do tipo AppPath
    },
  ],
  office: [
    { message: "Welcome to your Office! Here you can manage your Politikoz." },
    { message: "Click on 'My Politikoz' to see all the Politikoz you own." },
    { message: "Click on 'Election Info' to understand the election process." },
    { message: "Click on 'Prize Distribution' to see how rewards are divided." },
    { message: "That’s it! Now you are ready to explore the office." },
  ],
  party: [
    { message: "This is the Party Management section! Here you can create and join parties." },
    { message: "Use 'Create Party' to establish your own political group." },
    { message: "Parties influence elections, so choose wisely!" },
    { message: "You’re set! Good luck in the political world!" },
  ],
};
