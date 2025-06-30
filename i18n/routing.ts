import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported DEFINIR EM MIDDLEWARE.TS TAMBEM
  locales: ["en", "es", "fr", "pt", "de", "it", "nl", "no", "fil","ja"] as const,

  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    "/": {
      en: "/",
      es: "/",
      fr: "/",
      pt: "/",
      de: "/",
      it: "/",
      nl: "/",
      no: "/",
      fil: "/",
      ja: "/"
    },
    "/auth": {
      en: "/auth",             
      es: "/autenticar", 
      fr: "/authentifier",
      pt: "/autenticar", 
      de: "/authentifizieren",
      it: "/autenticare", 
      nl: "/authenticeren",
      no: "/autentisere", 
      fil: "/pagkilala",
      ja: "/認証"        // Japanese
    },   
    "/auth?origin=/office": {
    en: "/auth?origin=/office",
    es: "/autenticar?origin=/oficina",
    fr: "/authentifier?origin=/bureau",
    pt: "/autenticar?origin=/escritorio",
    de: "/authentifizieren?origin=/büro",
    it: "/autenticare?origin=/ufficio",
    nl: "/authenticeren?origin=/kantoor",
    no: "/autentisere?origin=/kontor",
    fil: "/pagkilala?origin=/opisina",
    ja: "/認証?origin=/オフィス"
  },
    "/explore": {
        en: "/explore", // English
        es: "/explorar", // Español
        fr: "/explorer", // Français
        pt: "/explorar", // Português
        de: "/erkunden", // Deutsch
        it: "/esplora", // Italiano
        nl: "/verkennen", // Nederlands
        no: "/utforske", // Norsk
        fil: "/galugarin", // Filipino
        ja: "/探索"        // Japanese
      },
      "/play": {
        en: "/play",    // English
        es: "/jugar",   // Español
        fr: "/jouer",   // Français
        pt: "/jogar",   // Português
        de: "/spielen", // Deutsch
        it: "/gioca",   // Italiano
        nl: "/spelen",  // Nederlands
        no: "/spille",  // Norsk
        fil: "/maglaro", // Filipino
        ja: "/プレイ"      // Japanese
      },
    "/hall": {
      "en": "/hall",
      "es": "/entrada",
      "fr": "/entree",
      "pt": "/entrada",
      "de": "/eingangshalle",
      "it": "/ingresso",
      "nl": "/ingang",
      "no": "/inngang",
      "fil": "/pasukan",
      "ja": "/ホール"      // Japanese
    },
      "/office": {
        en: "/office",
        es: "/oficina",
        fr: "/bureau",
        pt: "/escritorio",
        de: "/büro",
        it: "/ufficio",
        nl: "/kantoor",
        no: "/kontor",
        fil: "/opisina",
        ja: "/オフィス"    // Japanese
      },    
      "/office?section=buy-koz": {
  en: "/office?section=buy-koz",
  es: "/oficina?section=buy-koz",
  fr: "/bureau?section=buy-koz",
  pt: "/escritorio?section=buy-koz",
  de: "/büro?section=buy-koz",
  it: "/ufficio?section=buy-koz",
  nl: "/kantoor?section=buy-koz",
  no: "/kontor?section=buy-koz",
  fil: "/opisina?section=buy-koz",
  ja: "/オフィス?section=buy-koz"
}, 
"/office?section=my-tickets": {
  en: "/office?section=my-tickets",
  es: "/oficina?section=my-tickets",
  fr: "/bureau?section=my-tickets",
  pt: "/escritorio?section=my-tickets",
  de: "/büro?section=my-tickets",
  it: "/ufficio?section=my-tickets",
  nl: "/kantoor?section=my-tickets",
  no: "/kontor?section=my-tickets",
  fil: "/opisina?section=my-tickets",
  ja: "/オフィス?section=my-tickets"
},
      "/party": {
        en: "/party",
        es: "/partido",
        fr: "/parti",
        pt: "/partido",
        de: "/partei",
        it: "/partito",
        nl: "/partij",
        no: "/parti",
        fil: "/partido",
        ja: "/政党"        // Japanese
      },
      "/party?section=my-politikoz": {
  en: "/party?section=my-politikoz",
  es: "/partido?section=my-politikoz",
  fr: "/parti?section=my-politikoz",
  pt: "/partido?section=my-politikoz",
  de: "/partei?section=my-politikoz",
  it: "/partito?section=my-politikoz",
  nl: "/partij?section=my-politikoz",
  no: "/parti?section=my-politikoz",
  fil: "/partido?section=my-politikoz",
  ja: "/政党?section=my-politikoz"
},
      "/news": {
        "en": "/news",
        "es": "/noticiero",
        "fr": "/studio-journal",
        "pt": "/jornal",
        "de": "/nachrichtenstudio",
        "it": "/studio-notizie",
        "nl": "/nieuwsstudio",
        "no": "/nyhetsstudio",
        "fil": "/balitastudyo",
        ja: "/ニュース"    // Japanese
      },
      "/laundry": {
        en: "/laundry",
        es: "/lavanderia",
        fr: "/buanderie",
        pt: "/lavanderia",
        de: "/wascherei",
        it: "/lavanderia",
        nl: "/wasserij",
        no: "/vaskeri",
        fil: "/labahan",
        ja: "/ランドリー"  // Japanese
      },
      "/laundry?section=stake-plkoz": {
  en: "/laundry?section=stake-plkoz",
  es: "/lavanderia?section=stake-plkoz",
  fr: "/buanderie?section=stake-plkoz",
  pt: "/lavanderia?section=stake-plkoz",
  de: "/wascherei?section=stake-plkoz",
  it: "/lavanderia?section=stake-plkoz",
  nl: "/wasserij?section=stake-plkoz",
  no: "/vaskeri?section=stake-plkoz",
  fil: "/labahan?section=stake-plkoz",
  ja: "/ランドリー?section=stake-plkoz"
},
"/laundry?section=ticket-calculator": {
  en: "/laundry?section=ticket-calculator",
  es: "/lavanderia?section=ticket-calculator",
  fr: "/buanderie?section=ticket-calculator",
  pt: "/lavanderia?section=ticket-calculator",
  de: "/wascherei?section=ticket-calculator",
  it: "/lavanderia?section=ticket-calculator",
  nl: "/wasserij?section=ticket-calculator",
  no: "/vaskeri?section=ticket-calculator",
  fil: "/labahan?section=ticket-calculator",
  ja: "/ランドリー?section=ticket-calculator"
},
    "/team": {
      en: "/team",
      es: "/equipo",
      fr: "/equipe",
      pt: "/equipe",
      de: "/team",
      it: "/squadra",
      nl: "/team",
      no: "/team",
      fil: "/koponan",
      ja: "/チーム"      // Japanese
    },
    "/stake": {
      en: "/stake",
      es: "/participar",
      fr: "/participer",
      pt: "/stake",
      de: "/beteiligen",
      it: "/stake",
      nl: "/inzetten",
      no: "/stake",
      fil: "/stake",
      ja: "/ステーク"    // Japanese
    },
    "/treasury": {
      en: "/treasury",
      es: "/tesoreria",
      fr: "/tresor",
      pt: "/tesouro",
      de: "/schatz",
      it: "/tesoreria",
      nl: "/schatkist",
      no: "/skattekammer",
      fil: "/ingatang-yaman",
      ja: "/財務"        // Japanese
    },
    "/terms": {
      en: "/terms",
      es: "/terminos",
      fr: "/conditions",
      pt: "/termos",
      de: "/bedingungen",
      it: "/termini",
      nl: "/voorwaarden",
      no: "/vilkår",
      fil: "/mga-tuntunin",
      ja: "/利用規約"    // Japanese
    },
    "/privacy": {
      en: "/privacy",
      es: "/privacidad",
      fr: "/confidentialite",
      pt: "/privacidade",
      de: "/datenschutz",
      it: "/privacy",
      nl: "/privacy",
      no: "/personvern",
      fil: "/pribado",
      ja: "/プライバシー" // Japanese
    },
    "/arcade": {
      en: "/arcade",       // English
      es: "/arcada",       // Español
      fr: "/arcade",       // Français
      pt: "/arcade",       // Português
      de: "/spielhalle",   // Deutsch
      it: "/arcade",       // Italiano
      nl: "/arcade",       // Nederlands
      no: "/arkade",       // Norsk
      fil: "/arkada",      // Filipino
      ja: "/アーケード"    // Japanese
    },
    "/maintenance": {
      en: "/maintenance",     // English
      es: "/mantenimiento",   // Español
      fr: "/maintenance",     // Français
      pt: "/manutencao",      // Português
      de: "/wartung",         // Deutsch
      it: "/manutenzione",    // Italiano
      nl: "/onderhoud",       // Nederlands
      no: "/vedlikehold",     // Norsk
      fil: "/pagpapanatili",  // Filipino
      ja: "/メンテナンス"    // Japanese
    }
  }
});

// Deriva o tipo Locale diretamente de routing.locales
export type SupportedLocales = (typeof routing.locales)[number];

// Locale names for user-friendly display
export const localeNames: Record<SupportedLocales, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
  de: "Deutsch",
  it: "Italiano",
  nl: "Nederlands",
  no: "Norsk",
  fil: "Filipino",
  ja: "日本語", // Japanese
};

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type AppPath = keyof typeof routing.pathnames;
