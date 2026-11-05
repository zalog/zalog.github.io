// Site content. Text that differs per language is { en, ro }; everything else is shared.
export type Lang = "en" | "ro";
export type Localized = Record<Lang, string>;

/** Labels shown on the particle background; each one links to the row it belongs to */
export type Labels = (string | Localized)[];

/** `id` is the row's anchor (#res-, #exp- or #proj-<id>) */
export interface Result { id: string; key: string | Localized; where: string | Localized; text: Localized; labels?: Labels }
export interface Focus { title: string | Localized; text: Localized; labels?: Labels }
export interface Role { id: string; company: string | Localized; from: number; to: number | null; role: string; type?: "parttime" | "volunteer" | "freelance" | "contract" | "intern"; text?: Localized; labels?: Labels }
export interface Recent { id: string; name: string | Localized; href?: string; year: number; client: Localized; stack: string[]; text: Localized }
/** Without `href` the site is offline; `featured` sites are named in the intro of "Earlier projects" and on the particle background */
export interface Site { name: string; href?: string; skills: string[]; year: number; about: Localized; featured?: boolean }

/** Who the site is about. The email is kept in two parts, so no file holds the address as text. */
export const profile = {
  name: "Cătălin Zălog",
  role: "Senior Frontend Developer",
  city: { en: "Bucharest", ro: "București" } as Localized,
  stack: ["React", "Next.js", "TypeScript", "Node.js"],
  phone: { shown: "+40 721 213 882", e164: "+40721213882" },
  email: ["catalin.site", "zalog.ro"],
};

/** Counted when the site is built, so each build has the current numbers */
const thisYear = new Date().getFullYear();
export const years = { web: thisYear - 2002, react: thisYear - 2018 };

export const results: Result[] = [
  {
    "id": "vivre-migration",
    "labels": [{ "en": "~60k concurrent users", "ro": "~60k utilizatori simultani" }, "PageSpeed 15 → 90"],
    "key": {
      "en": "4 mo",
      "ro": "4 luni"
    },
    "where": "Vivre",
    "text": {
      "en": "Led the migration of Vivre's e-commerce storefront to Vue 2 with a 6-person frontend team, shipped ahead of a hard Black Friday deadline: ~60k concurrent users at the peak with no downtime across 9 European markets, and mobile PageSpeed up from 15 to 90.",
      "ro": "Am condus migrarea magazinului online Vivre pe Vue 2, cu o echipă frontend de 6 oameni, și am livrat-o înainte de termenul fix de Black Friday: ~60k utilizatori simultani la vârf, fără downtime, în 9 piețe europene, iar scorul PageSpeed pe mobil a crescut de la 15 la 90."
    }
  },
  {
    "id": "school-principals",
    "key": {
      "en": "~6,900",
      "ro": "~6.900"
    },
    "where": {
      "en": "Ministry of Education and Research",
      "ro": "Ministerul Educației și Cercetării"
    },
    "text": {
      "en": "Applications in the 2026 national school principals competition, on a platform I took over alone after four years unused: Node.js 14 → 24, PostgreSQL 13 → 18, pentest findings fixed and the security audit of STS (Romania’s Special Telecommunications Service) passed before any new feature.",
      "ro": "Dosare la concursul național de directori din 2026, pe o platformă preluată singur după patru ani în care n-a fost folosită: Node.js 14 → 24, PostgreSQL 13 → 18, problemele din pentest rezolvate și auditul de securitate STS trecut înainte de orice funcționalitate nouă."
    }
  },
  {
    "id": "vue-to-next",
    "labels": ["Vue 2 → Vue 3 → Next.js"],
    "key": "Vue → Next",
    "where": "Neogen",
    "text": {
      "en": "Set Vivre's path from Vue 2 to Vue 3 composables, so the port to Next.js became a translation of state and logic instead of a rewrite.",
      "ro": "Am stabilit planul de migrare al Vivre de la Vue 2 la composables în Vue 3, astfel încât trecerea pe Next.js să fie o transpunere a stării și a logicii, nu o rescriere."
    }
  },
  {
    "id": "pentest",
    "labels": [{ "en": "CSP nonces · SSRF", "ro": "CSP cu nonce · SSRF" }],
    "key": "CSP · SSRF",
    "where": "Defendermate",
    "text": {
      "en": "Closed pentest findings with per-request CSP nonces, SSRF hardening and a redesigned session invalidation across repos.",
      "ro": "Am rezolvat vulnerabilitățile găsite la pentest: CSP cu nonce per request, protecție SSRF și invalidarea sesiunilor regândită în mai multe repo-uri."
    }
  },
  {
    "id": "bootstrap",
    "key": "44",
    "where": "Bootstrap",
    "text": {
      "en": "Commits merged into Bootstrap between 2014 and 2023, mostly in the Sass source of Bootstrap 4 and 5: variables, forms, grid and navbar.",
      "ro": "Commit-uri acceptate în Bootstrap între 2014 și 2023, mai ales în codul Sass din Bootstrap 4 și 5: variabile, formulare, grid și navbar."
    }
  },
  {
    "id": "placeholder-loading",
    "key": "~20k",
    "where": "placeholder-loading",
    "text": {
      "en": "Weekly npm downloads of placeholder-loading, my CSS-only loading placeholder, with ~1.5k stars on GitHub.",
      "ro": "Descărcări pe săptămână pe npm pentru placeholder-loading, animația mea de încărcare doar din CSS, cu ~1,5k stele pe GitHub."
    }
  }
];

export const focus: Focus[] = [
  {
    "title": profile.stack.join(" · "),
    "labels": [profile.stack.slice(0, 3).join(" · "), "SSR · ISR"],
    "text": {
      "en": "Component systems, SSR and ISR, performance budgets.",
      "ro": "Sisteme de componente, SSR și ISR, bugete de performanță."
    }
  },
  {
    "title": {
      "en": "Design systems",
      "ro": "Design systems"
    },
    "labels": ["Design systems"],
    "text": {
      "en": "Shared UI libraries used across several products and teams.",
      "ro": "Biblioteci UI comune, folosite de mai multe produse și echipe."
    }
  },
  {
    "title": {
      "en": "Complex B2B interfaces",
      "ro": "Interfețe B2B complexe"
    },
    "text": {
      "en": "Dashboards, large tables, complex filtering, real-time state.",
      "ro": "Dashboard-uri, tabele mari, filtrări complexe, stare în timp real."
    }
  },
  {
    "title": {
      "en": "Tooling and CI/CD",
      "ro": "Tooling și CI/CD"
    },
    "text": {
      "en": "Build pipelines, code quality, review culture.",
      "ro": "Pipeline-uri de build, calitatea codului, cultura de code review."
    }
  }
];

export const experience: Role[] = [
  {
    "id": "ministry-of-education-and-research",
    "company": {
      "en": "Ministry of Education and Research",
      "ro": "Ministerul Educației și Cercetării"
    },
    "from": 2026,
    "to": null,
    "role": "Full Stack Engineer",
    "type": "contract",
    "text": {
      "en": "Sole developer of the national school principals competition platform: security, upgrades, new features after the STS audit, plus the infrastructure in the government cloud (Docker, Caddy, mail, monitoring, backups, load tests).",
      "ro": "Singurul developer al platformei concursului național de directori: securitate, actualizări, funcționalități noi după auditul STS, plus infrastructura din cloudul guvernamental (Docker, Caddy, mail, monitorizare, backup, teste de încărcare)."
    }
  },
  {
    "id": "defendermate",
    "company": "Defendermate",
    "from": 2026,
    "to": null,
    "role": "Full Stack Engineer",
    "type": "contract",
    "text": {
      "en": "Security remediation, attack-path graphs, integration APIs and an AWS setup wizard, type-safety work ahead of the React Compiler, a new app shell with a command palette.",
      "ro": "Remedieri de securitate, grafuri de atac, API-uri de integrare și un wizard de configurare AWS, type-safety pentru adoptarea React Compiler, un nou shell al aplicației cu command palette."
    }
  },
  {
    "id": "neogen",
    "company": "Neogen",
    "from": 2023,
    "to": 2026,
    "role": "Senior Frontend Engineer",
    "text": {
      "en": "Vivre migration path to Next.js, a ride-sharing website from scratch, BestJobs on the App Router, design system components and technical SEO.",
      "ro": "Traseul de migrare Vivre spre Next.js, un site de ride-sharing de la zero, BestJobs pe App Router, componente de design system și SEO tehnic."
    }
  },
  {
    "id": "vivre-deco",
    "company": "Vivre Deco",
    "from": 2018,
    "to": 2023,
    "role": "Senior Frontend Engineer",
    "labels": ["Core Web Vitals"],
    "text": {
      "en": "Led the storefront migration and the performance work after it, coordinated the external React Native team, mentored junior developers.",
      "ro": "Am condus migrarea magazinului și optimizările de performanță care au urmat, am coordonat echipa externă de React Native, am fost mentor pentru juniori."
    }
  },
  {
    "id": "life-is-hard-work-soft",
    "company": "Life Is Hard - Work Soft",
    "from": 2023,
    "to": 2023,
    "role": "Senior Frontend Engineer",
    "type": "parttime",
    "text": {
      "en": "Frontend architecture and mentoring with Vue, Nuxt and Tailwind CSS.",
      "ro": "Arhitectură frontend și mentorat, cu Vue, Nuxt și Tailwind CSS."
    }
  },
  {
    "id": "civictech-romania",
    "company": "CivicTech Romania",
    "from": 2018,
    "to": 2018,
    "role": "Frontend Engineer",
    "type": "volunteer"
  },
  {
    "id": "govit-hub",
    "company": "GovIT Hub",
    "from": 2016,
    "to": 2017,
    "role": "Senior Frontend Developer",
    "type": "volunteer",
    "text": {
      "en": "Web and mobile apps published on the organization’s GitHub, among them ROdiaspora, an Angular mobile app.",
      "ro": "Aplicații web și mobile publicate pe GitHub-ul organizației, printre care ROdiaspora, o aplicație mobilă în Angular."
    }
  },
  {
    "id": "republica-ro",
    "company": "Republica.ro",
    "from": 2015,
    "to": 2016,
    "role": "Senior Frontend Developer",
    "type": "freelance",
    "text": {
      "en": "Frontend and technical project management, Vagrant workflow, Git branching strategy.",
      "ro": "Frontend și management tehnic de proiect, workflow cu Vagrant, strategie de branching în Git."
    }
  },
  {
    "id": "1616-ro",
    "company": "1616.ro",
    "from": 2015,
    "to": 2018,
    "role": "Senior Frontend Developer",
    "text": {
      "en": "Frontend for the agency’s projects, among them digi24.ro; email and banner templates, project management, development flow and mentoring.",
      "ro": "Frontend pentru proiectele agenției, printre care digi24.ro; template-uri de email și de bannere, management de proiect, flux de dezvoltare și mentorat."
    }
  },
  {
    "id": "mediafax-group",
    "company": "Mediafax Group",
    "from": 2008,
    "to": 2015,
    "role": "Senior Frontend Developer",
    "text": {
      "en": "Frontend for news and media sites, support for backend teams, UX feedback for designers and product managers, mentoring and hiring.",
      "ro": "Frontend pentru site-uri de știri și media, suport pentru echipele de backend, feedback UX pentru designeri și product manageri, mentorat și recrutare."
    }
  },
  {
    "id": "orbital-voice",
    "company": "Orbital Voice",
    "from": 2010,
    "to": 2010,
    "role": "Frontend Developer",
    "type": "freelance"
  },
  {
    "id": "xhtml4u-com",
    "company": "XHTML4U.com",
    "from": 2008,
    "to": 2009,
    "role": "Frontend Developer",
    "type": "freelance"
  },
  {
    "id": "republik-agency",
    "company": "rePublik agency",
    "from": 2007,
    "to": 2009,
    "role": "Frontend Developer",
    "type": "freelance",
    "text": {
      "en": "bmw.ro, vibefm.ro, revistavip.net and others.",
      "ro": "bmw.ro, vibefm.ro, revistavip.net și altele."
    }
  },
  {
    "id": "blue-soft",
    "company": "Blue Soft",
    "from": 2005,
    "to": 2008,
    "role": "Frontend Developer",
    "text": {
      "en": "worldclass.ro and many hospital websites.",
      "ro": "worldclass.ro și multe site-uri de spitale."
    }
  },
  {
    "id": "webworks",
    "company": "Webworks",
    "from": 2003,
    "to": 2005,
    "role": "Frontend Developer",
    "type": "contract"
  },
  {
    "id": "anomic",
    "company": "Anomic",
    "from": 2002,
    "to": 2002,
    "role": "Frontend Developer",
    "type": "intern"
  }
];

export const recent: Recent[] = [
  {
    "id": "culte-gov-ro",
    "name": "culte.gov.ro",
    "href": "https://culte.gov.ro/",
    "year": 2026,
    "client": {
      "en": "State Secretariat for Religious Affairs",
      "ro": "Secretariatul de Stat pentru Culte"
    },
    "stack": [
      "WordPress",
      "PHP",
      "Tailwind CSS 4",
      "Vite",
      "DDEV"
    ],
    "text": {
      "en": "New website for the Romanian State Secretariat for Religious Affairs: a custom WordPress theme on Tailwind CSS 4 and Vite, pages for each recognised denomination, an interactive map fed from CSV imports, and a bilingual RO/EN interface.",
      "ro": "Site-ul nou al Secretariatului de Stat pentru Culte: temă WordPress proprie pe Tailwind CSS 4 și Vite, pagini pentru fiecare cult recunoscut, o hartă interactivă alimentată din importuri CSV și interfață bilingvă RO/EN."
    }
  },
  {
    "id": "school-principals-competition-platform",
    "name": {
      "en": "School principals competition platform",
      "ro": "Platforma concursului de directori"
    },
    "year": 2026,
    "client": {
      "en": "Ministry of Education and Research",
      "ro": "Ministerul Educației și Cercetării"
    },
    "stack": [
      "Node.js",
      "PostgreSQL",
      "Docker",
      "Caddy",
      "ClamAV",
      "Pug",
      "Bootstrap"
    ],
    "text": {
      "en": "Application platform for the national school principals competition: candidate accounts and application files, document uploads scanned by ClamAV, applying for a specific post in a school, receipts and emails with the exam calendar, the commissions' review workflow and reports, and the national school network built from the Ministry's spreadsheets.",
      "ro": "Platforma de înscriere la concursul național de directori de școli: conturi și dosare pentru candidați, documente scanate antivirus la încărcare, înscriere pe un post anume dintr-o școală, confirmări și emailuri cu calendarul probelor, fluxul de evaluare al comisiilor și rapoarte, plus rețeaua școlară națională construită din fișierele Ministerului."
    }
  },
  {
    "id": "basilica-ro",
    "name": "basilica.ro",
    "href": "https://basilica.ro/",
    "year": 2026,
    "client": {
      "en": "Romanian Patriarchate news agency",
      "ro": "Agenția de știri a Patriarhiei Române"
    },
    "stack": [
      "Next.js",
      "ISR",
      "WordPress",
      "Cloudflare"
    ],
    "text": {
      "en": "News site on Next.js with incremental static regeneration over a headless WordPress, with cache purging from the editor, Cloudflare in front and Romanian and English editions.",
      "ro": "Site de știri pe Next.js cu regenerare statică incrementală peste un WordPress headless, cu golirea cache-ului din editor, Cloudflare ca CDN și ediții în română și engleză."
    }
  },
  {
    "id": "cabral-ro",
    "name": "cabral.ro",
    "href": "https://www.cabral.ro/",
    "year": 2026,
    "client": {
      "en": "Personal blog of Cabral Ibacka",
      "ro": "Blogul lui Cabral Ibacka"
    },
    "stack": [
      "Nuxt",
      "Vue",
      "WordPress",
      "Node.js"
    ],
    "text": {
      "en": "A blog I first built in 2014, rebuilt as a Nuxt frontend reading from a headless WordPress.",
      "ro": "Un blog pe care l-am făcut în 2014, refăcut ca frontend Nuxt care citește dintr-un WordPress headless."
    }
  }
];

export const social: { label: string; href: string }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zalog/" },
  { label: "GitHub", href: "https://github.com/zalog" },
  { label: "Stack Overflow", href: "https://stackoverflow.com/users/2977191/zalog" },
  { label: "CodePen", href: "https://codepen.io/zalog/" },
  { label: "Medium", href: "https://medium.com/@zalog" },
  { label: "ZaBlog", href: "https://zablog.ro/" },
];

/** Shown under "Earlier projects". An empty href means the site is offline. */
export const earlier: Site[] = [
  { name: "revistavip.net", year: 2008, about: { en: "Site of VIP, a celebrity magazine", ro: "Site-ul revistei mondene VIP" }, skills: ["html", "css"] },
  { name: "americanexperience.ro", href: "https://www.americanexperience.ro/", year: 2008, about: { en: "Agency for Work & Travel USA, H2B and Au Pair programs", ro: "Agenție pentru programe Work & Travel USA, H2B și Au Pair" }, skills: ["html", "css"] },
  { name: "turabo-cafe.ro", year: 2008, about: { en: "Site of the Turabo Cafe coffee chain", ro: "Site-ul cafenelelor Turabo Cafe" }, skills: ["html", "css"] },
  { name: "bmw.ro", featured: true, href: "https://www.bmw.ro/", year: 2008, about: { en: "Official site of BMW Romania, built in Flash with XML content", ro: "Site-ul oficial BMW România, în Flash, cu conținut din XML" }, skills: ["xml", "html", "flash"] },
  { name: "vibefm.ro", href: "http://www.vibefm.ro/", year: 2008, about: { en: "Site of Vibe FM, a dance-music radio network", ro: "Site-ul Vibe FM, rețea de radio cu muzică dance" }, skills: ["html", "css"] },
  { name: "sportlaminut.ro", year: 2009, about: { en: "Sports news, mostly football", ro: "Știri sportive, mai ales fotbal" }, skills: ["html", "css"] },
  { name: "creativeweek.org", year: 2009, about: { en: "A web designer's blog and portfolio", ro: "Blogul și portofoliul unui web designer" }, skills: ["wordpress", "php", "html", "css"] },
  { name: "greenblog.descopera.ro", year: 2009, about: { en: "Environment blog of Descoperă magazine", ro: "Blogul de mediu al revistei Descoperă" }, skills: ["wordpress", "php", "html", "css"] },
  { name: "blog.provideo.ro", year: 2009, about: { en: "Movie blog of the Pro Video DVD label", ro: "Blogul de filme al Pro Video" }, skills: ["wordpress", "php", "html", "css"] },
  { name: "intrefete.ro", year: 2010, about: { en: "Women's lifestyle site", ro: "Site de lifestyle pentru femei" }, skills: ["html", "css"] },
  { name: "m.apropoid.ro", year: 2010, about: { en: "Mobile sign-in for Apropo accounts", ro: "Autentificare pe mobil în contul Apropo" }, skills: ["html", "css"] },
  { name: "prosport.ro - v2010", year: 2010, about: { en: "Site of ProSport, a national sports daily", ro: "Site-ul ProSport, cotidian sportiv național" }, skills: ["html", "css"] },
  { name: "soferderomania.promotor.ro - v2010", year: 2010, about: { en: "Online driving game by Promotor and Opel", ro: "Joc online de condus, de la Promotor și Opel" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "liga.prosport.ro - v2010", year: 2010, about: { en: "ProSport's fantasy football game", ro: "Jocul de fantasy football ProSport" }, skills: ["html", "css"] },
  { name: "fratelli.ro", href: "http://www.fratelli.ro/", year: 2011, about: { en: "Site of Fratelli, Bucharest nightclubs and social events", ro: "Site-ul Fratelli, cluburi și evenimente din București" }, skills: ["html", "css"] },
  { name: "one.ro", year: 2011, about: { en: "Fashion site of ONE magazine", ro: "Site-ul de modă al revistei ONE" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "descopera.ro", featured: true, href: "http://www.descopera.ro/", year: 2011, about: { en: "Site of Descoperă, a science magazine", ro: "Site-ul revistei de știință Descoperă" }, skills: ["html", "css", "jQuery"] },
  { name: "orlando.ro - v2011", href: "http://www.orlando.ro/", year: 2011, about: { en: "Orlando Nicoară's blog on internet and media", ro: "Blogul lui Orlando Nicoară despre internet și media" }, skills: ["html", "css", "wordpress", "php"] },
  { name: "storageroom.ro", year: 2011, about: { en: "Site of the Storage Room bar", ro: "Site-ul barului Storage Room" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "oanacuzino.csid.ro", year: 2011, about: { en: "Health blog of TV doctor Oana Cuzino", ro: "Blogul de sănătate al doctoriței Oana Cuzino" }, skills: ["wordpress", "php", "html", "css", "javascript"] },
  { name: "thecitybreak.ro", year: 2011, about: { en: "Guide to European city breaks", ro: "Ghid de city break-uri în Europa" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "m.apropo.ro", year: 2011, about: { en: "Mobile site of the Apropo portal", ro: "Site-ul de mobil al portalului Apropo" }, skills: ["html", "css"] },
  { name: "m.ro", href: "http://www.m.ro/", year: 2011, about: { en: "Corporate site of Mediafax Group", ro: "Site-ul corporate al Mediafax Group" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "alo-moda.ro", year: 2011, about: { en: "AloModa fashion blog", ro: "Blogul de modă AloModa" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "businessdevelopment.ro", year: 2012, about: { en: "Business consulting firm", ro: "Firmă de consultanță în afaceri" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "liga.prosport.ro", year: 2012, about: { en: "ProSport's fantasy football game", ro: "Jocul de fantasy football ProSport" }, skills: ["html", "css", "jQuery"] },
  { name: "gq.ro", year: 2012, about: { en: "Site of GQ Romania, the men's magazine", ro: "Site-ul revistei pentru bărbați GQ România" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "cineconduce.promotor.ro", year: 2012, about: { en: "Driving contest by Promotor and Opel", ro: "Concurs auto, de la Promotor și Opel" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "travel.descopera.ro", year: 2012, about: { en: "Travel section of Descoperă magazine", ro: "Secțiunea de călătorii a revistei Descoperă" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "afiliere.mobilio.ro", year: 2012, about: { en: "Sign-up for the Mobilio mobile ad network", ro: "Înscriere în rețeaua de reclame mobile Mobilio" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "bound.ro", href: "http://bound.ro/", year: 2013, about: { en: "Site of the Bound club in Bucharest", ro: "Site-ul clubului Bound din București" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "tortionari.gandul.info", year: 2013, about: { en: "Gândul report on communist-era torturers", ro: "Investigația Gândul despre torționarii comuniști" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "prosport.ro", featured: true, href: "http://www.prosport.ro/", year: 2013, about: { en: "Site of ProSport, a national sports daily", ro: "Site-ul ProSport, cotidian sportiv național" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "autopro.ro", href: "http://www.autopro.ro/", year: 2013, about: { en: "Site of the AutoPro car magazine", ro: "Site-ul revistei auto AutoPro" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "tirbuson.ro", year: 2013, about: { en: "Wine club and online wine shop", ro: "Club de vinuri și magazin online" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "csid.ro", href: "http://www.csid.ro/", year: 2013, about: { en: "Women's health and lifestyle magazine", ro: "Revistă de sănătate și lifestyle pentru femei" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "criserb.com", href: "https://www.criserb.com/blog/", year: 2013, about: { en: "Personal blog of Romanian blogger Cristi Șerb", ro: "Blogul personal al bloggerului Cristi Șerb" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "nush.ro", href: "https://nush.ro/", year: 2014, about: { en: "Q&A community", ro: "Comunitate de întrebări și răspunsuri" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "cabral.ro", href: "https://www.cabral.ro/", year: 2014, about: { en: "Blog of TV presenter and actor Cabral Ibacka", ro: "Blogul prezentatorului TV și actorului Cabral Ibacka" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "apropotv.ro", href: "http://www.apropotv.ro/", year: 2014, about: { en: "TV guide and entertainment news", ro: "Ghid TV și știri de divertisment" }, skills: ["html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "practica-ta.ro", year: 2014, about: { en: "Student internship platform by Adecco", ro: "Platformă de stagii pentru studenți, de la Adecco" }, skills: ["wordpress", "php", "mysql", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "ozinparis.com", href: "http://ozinparis.com/", year: 2015, about: { en: "Fashion and travel blog OZ in Paris", ro: "Blogul de modă și călătorii OZ in Paris" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript"] },
  { name: "caloria.ro", href: "http://www.caloria.ro/", year: 2015, about: { en: "Diet and nutrition site", ro: "Site despre dietă și nutriție" }, skills: ["html", "css", "less", "bootstrap", "jQuery", "javascript"] },
  { name: "andreeaibacka.ro", href: "https://andreeaibacka.ro/", year: 2015, about: { en: "Personal site of actress Andreea Ibacka", ro: "Site-ul personal al actriței Andreea Ibacka" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "republica.ro", featured: true, href: "https://republica.ro/", year: 2015, about: { en: "Opinion platform with columns by public figures and experts", ro: "Platformă de opinie cu texte semnate de oameni publici și experți" }, skills: ["html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "git", "PM"] },
  { name: "suntmamica.ro", href: "http://www.suntmamica.ro/", year: 2016, about: { en: "Parenting site and community for mothers", ro: "Site și comunitate pentru mame" }, skills: ["html", "php", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp", "git"] },
  { name: "gobet.ro", year: 2016, about: { en: "Site of the GOBet sports betting operator", ro: "Site-ul casei de pariuri GOBet" }, skills: ["html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp"] },
  { name: "basilica.ro", href: "http://www.basilica.ro/", year: 2016, about: { en: "News agency of the Romanian Patriarchate", ro: "Agenția de știri a Patriarhiei Române" }, skills: ["wordpress", "php", "html", "css", "sass", "bootstrap", "jQuery", "javascript", "vagrant", "nodejs", "gulp", "git"] },
  { name: "digi24.ro", featured: true, href: "https://www.digi24.ro/", year: 2016, about: { en: "Site of the Digi24 news channel, mobile and desktop", ro: "Site-ul televiziunii de știri Digi24, mobil și desktop" }, skills: ["html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp", "git"] },
  { name: "kanald.ro", featured: true, href: "http://www.kanald.ro/", year: 2017, about: { en: "Site of the Kanal D TV channel", ro: "Site-ul televiziunii Kanal D" }, skills: ["html", "css", "sass", "bootstrap", "javascript", "nodejs", "gulp", "vagrant", "git"] },
  { name: "gaseste.ro", href: "http://www.gaseste.ro/", year: 2017, about: { en: "Marketplace for local service providers", ro: "Platformă pentru servicii locale" }, skills: ["php", "html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp", "vagrant", "git", "PM"] },
  { name: "vreaudeviz.ro", year: 2017, about: { en: "Online quotes for home renovation", ro: "Devize online pentru renovări" }, skills: ["html", "css", "sass", "bootstrap", "vue.js", "javascript", "nodejs", "gulp"] },
  { name: "trinitas.tv", featured: true, href: "https://www.trinitas.tv/", year: 2017, about: { en: "Site of Trinitas TV, the Patriarchate's TV channel", ro: "Site-ul Trinitas TV, televiziunea Patriarhiei" }, skills: ["wordpress", "php", "mysql", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "webpack", "gulp", "vagrant", "git", "ci", "cd"] },
  { name: "ROdiaspora", href: "http://ithub.gov.ro/2016/12/09/rodiaspora/", year: 2017, about: { en: "Mobile app for Romanians abroad", ro: "Aplicație mobilă pentru românii din diaspora" }, skills: ["angular", "rxjs", "ionic", "typescript", "javascript", "cordova"] },
  { name: "iaa.ro", href: "http://www.iaa.ro/", year: 2018, about: { en: "Romanian chapter of the IAA advertising association", ro: "Filiala română a asociației de publicitate IAA" }, skills: ["wordpress", "php", "html", "css", "sass", "bootstrap", "jQuery", "javascript", "webpack", "gulp", "nodejs", "git"] },
];
