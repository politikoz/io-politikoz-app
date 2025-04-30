import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported DEFINIR EM MIDDLEWARE.TS TAMBEM
  locales: ["en", "es", "fr", "pt", "de", "it", "nl", "no", "fil"] as const,

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
    },
    "/auth": {
      en: "/auth",       // English
      es: "/autenticar", // Español
      fr: "/authentifier", // Français
      pt: "/autenticar", // Português
      de: "/authentifizieren", // Deutsch
      it: "/autenticare", // Italiano
      nl: "/authenticeren", // Nederlands
      no: "/autentisere", // Norsk
      fil: "/pagkilala"  // Filipino
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
        fil: "/maglaro" // Filipino
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
      "fil": "/pasukan"
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
        fil: "/opisina"
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
        fil: "/partido"
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
        "fil": "/balitastudyo"
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
        fil: "/labahan"
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
      fil: "/arkada"       // Filipino
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
};

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export type AppPath = keyof typeof routing.pathnames;
