export type Lang = "en" | "ro";
export type Localized = Record<Lang, string>;

/** Labels shown on the particle background; each one links to the row it belongs to */
export type Labels = (string | Localized)[];

/** `id` is the row's anchor (#res-, #exp- or #proj-<id>) */
export interface Result { id: string; key: string | Localized; where: string | Localized; text: Localized; labels?: Labels }
export interface Focus { title: string | Localized; text: Localized; labels?: Labels }
export interface Role { id: string; company: string | Localized; from: number; to: number | null; role: string; type?: "parttime" | "volunteer" | "freelance" | "contract" | "intern"; text?: Localized; labels?: Labels }
export interface Recent { id: string; name: string | Localized; href?: string; year: number; client: Localized; stack: string[]; text: Localized; labels?: Labels }
/** Without `href` the site is offline; `featured` sites are named in the intro of "Earlier projects" */
export interface Site { name: string; href?: string; skills: string[]; year: number; about: Localized; featured?: boolean; nofollow?: boolean; labels?: Labels }

/** The email is kept in two parts, so no file holds the address as text. */
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
    "id": "school-principals",
    "labels": [{ "en": "~7k applications", "ro": "~7k de dosare" }],
    "key": "~7k",
    "where": {
      "en": "Ministry of Education and Research",
      "ro": "Ministerul Educației și Cercetării"
    },
    "text": {
      "en": "Applications in the 2026 national school principals competition, on a platform that sat unused for four years. I took it over alone, upgraded Node.js 14 → 24 and PostgreSQL 13 → 18, fixed the pentest findings and passed the security audit of STS (Romania’s Special Telecommunications Service) before adding anything new.",
      "ro": "Dosare la concursul național de directori din 2026, pe o platformă nefolosită de patru ani. Am preluat-o singur, am actualizat Node.js 14 → 24 și PostgreSQL 13 → 18, am rezolvat problemele din pentest și am trecut auditul de securitate STS înainte să adaug ceva nou."
    }
  },
  {
    "id": "vivre-migration",
    "labels": [{ "en": "~60k concurrent users", "ro": "~60k de utilizatori simultani" }, "PageSpeed 15 → 90"],
    "key": {
      "en": "4 months",
      "ro": "4 luni"
    },
    "where": "Vivre",
    "text": {
      "en": "To move the online store to Vue 2. I led a 6-person frontend team and we made it in time for Black Friday: ~60k concurrent users at the peak, no downtime in any of the 9 countries, and mobile PageSpeed up from 15 to 90.",
      "ro": "Atât a durat migrarea magazinului online pe Vue 2. Am condus o echipă frontend de 6 oameni și am terminat la timp pentru Black Friday: ~60k de utilizatori simultani la vârf, fără downtime în niciuna dintre cele 9 țări, iar scorul PageSpeed pe mobil a urcat de la 15 la 90."
    }
  },
  {
    "id": "bootstrap",
    "labels": [{ "en": "Bootstrap · 44 commits", "ro": "Bootstrap · 44 de commit-uri" }],
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
      "en": "Weekly npm downloads of placeholder-loading, a skeleton loader I wrote in pure CSS. It also has ~1.5k stars on GitHub.",
      "ro": "Descărcări pe săptămână pe npm pentru placeholder-loading, un skeleton loader pe care l-am scris doar în CSS. Are și ~1.500 de stele pe GitHub."
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
      "en": "Dashboards, large tables, advanced filtering, real-time state.",
      "ro": "Dashboard-uri, tabele mari, filtre avansate, stare în timp real."
    }
  },
  {
    "title": {
      "en": "Tooling and CI/CD",
      "ro": "Tooling și CI/CD"
    },
    "text": {
      "en": "Build pipelines, code quality, code reviews that actually help.",
      "ro": "Pipeline-uri de build, calitatea codului, code review care chiar ajută."
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
      "en": "Sole developer of concursdirectori.edu.ro, the national school principals competition platform, from the code to the infrastructure in the government cloud: Docker, Caddy, mail, monitoring, backups. ~150 integration tests over HTTP pinned the platform’s behavior before the Node.js and PostgreSQL upgrades; a load test on staging measured upload and browse traffic.",
      "ro": "Lucrez singur la concursdirectori.edu.ro, platforma concursului național de directori, de la cod până la infrastructura din cloudul guvernamental: Docker, Caddy, mail, monitorizare, backup. ~150 de teste de integrare prin HTTP au fixat comportamentul platformei înainte de upgrade-urile de Node.js și PostgreSQL; un test de încărcare pe staging a măsurat traficul de navigare și de upload-uri."
    }
  },
  {
    "id": "defendermate",
    "company": "Defendermate",
    "from": 2026,
    "to": null,
    "role": "Full Stack Engineer",
    "type": "contract",
    "labels": [{ "en": "CSP nonces · SSRF", "ro": "CSP cu nonce · SSRF" }],
    "text": {
      "en": "Pentest fixes across repos (per-request CSP nonces, SSRF hardening, reworked session invalidation), attack-path graphs, integration APIs, an AWS setup wizard, stricter types to get ready for the React Compiler, and a new app shell with a command palette.",
      "ro": "Fix-uri după pentest în mai multe repo-uri (CSP cu nonce per request, protecție SSRF, altă logică de invalidare a sesiunilor), grafuri cu căile de atac, API-uri de integrare, un wizard de configurare pentru AWS, tipuri mai stricte ca să putem trece pe React Compiler și o interfață nouă pentru aplicație, cu command palette."
    }
  },
  {
    "id": "neogen",
    "company": "Neogen",
    "from": 2023,
    "to": 2026,
    "role": "Senior Frontend Engineer",
    "labels": ["Vue 2 → Vue 3 → Next.js"],
    "text": {
      "en": "Vivre’s migration plan to Next.js: Vue 3 first, with the logic moved into composables so it could later be ported without a rewrite; a ride-sharing website from scratch, BestJobs on the App Router, design system components and technical SEO.",
      "ro": "Planul de migrare al Vivre spre Next.js: întâi pe Vue 3, cu logica scoasă în composables, ca s-o putem muta apoi fără s-o rescriem; un site de ride-sharing de la zero, BestJobs pe App Router, componente de design system și SEO tehnic."
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
      "en": "Led the storefront migration and the performance work after it, coordinated the external React Native team and mentored junior developers.",
      "ro": "Am condus migrarea magazinului și optimizările de performanță care au urmat, am coordonat echipa externă de React Native și am fost mentor pentru juniori."
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
    "labels": ["ROdiaspora"],
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
      "en": "Frontend for the agency’s projects, among them digi24.ro; email and banner templates, project management, development workflow and mentoring.",
      "ro": "Frontend pentru proiectele agenției, printre care digi24.ro; template-uri de email și de bannere, management de proiect, procesul de dezvoltare și mentorat."
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
    "labels": ["worldclass.ro"],
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
    "labels": ["culte.gov.ro"],
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
      "en": "New website for the Romanian State Secretariat for Religious Affairs: a custom WordPress theme on Tailwind CSS 4 and Vite, pages for each recognized denomination, an interactive map with data imported from CSV, and an interface in Romanian and English.",
      "ro": "Site-ul nou al Secretariatului de Stat pentru Culte: o temă WordPress proprie pe Tailwind CSS 4 și Vite, pagini pentru fiecare cult recunoscut, o hartă interactivă cu date importate din CSV și interfață în română și engleză."
    }
  },
  {
    "id": "school-principals-competition-platform",
    "labels": [{ "en": "~90k documents", "ro": "~90k de documente" }],
    "name": "concursdirectori.edu.ro",
    "href": "https://concursdirectori.edu.ro/",
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
      "en": "Application platform for the national school principals competition: candidate accounts and application files, with ~90k uploaded documents scanned by ClamAV. Candidates apply for a specific post in a school and get confirmations and emails with the exam calendar; commissions review the files and pull reports. The national school network is imported from the Ministry’s spreadsheets.",
      "ro": "Platforma de înscriere la concursul național de directori de școli: conturi și dosare pentru candidați, cu ~90k de documente scanate antivirus la încărcare. Candidații se înscriu pe un post anume dintr-o școală și primesc confirmări și e-mailuri cu calendarul probelor, iar comisiile evaluează dosarele și scot rapoarte. Rețeaua școlară națională e importată din fișierele Ministerului."
    }
  },
  {
    "id": "basilica-ro",
    "name": "basilica.ro",
    "labels": ["basilica.ro"],
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
      "en": "News site on Next.js reading from a headless WordPress, with incremental static regeneration, cache purging from the editor, Cloudflare in front, and editions in Romanian and English.",
      "ro": "Site de știri pe Next.js care citește dintr-un WordPress headless, cu ISR, cache golit direct din editor, Cloudflare ca CDN și ediții în română și engleză."
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
      "en": "A blog I first built in 2014, now rebuilt in Nuxt on top of a headless WordPress.",
      "ro": "Un blog pe care l-am făcut în 2014, refăcut acum în Nuxt, peste un WordPress headless."
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

/** Shown under "Earlier projects" */
export const earlier: Site[] = [
  { name: "revistavip.net", year: 2008, about: { en: "VIP, a celebrity magazine", ro: "Site-ul revistei mondene VIP" }, skills: ["html", "css"] },
  { name: "americanexperience.ro", href: "https://www.americanexperience.ro/", year: 2008, about: { en: "Agency for Work & Travel USA, H2B and Au Pair programs", ro: "Agenție pentru programe Work & Travel USA, H2B și Au Pair" }, skills: ["html", "css"] },
  { name: "turabo-cafe.ro", year: 2008, about: { en: "Turabo Cafe, a coffee chain", ro: "Site-ul cafenelelor Turabo Cafe" }, skills: ["html", "css"] },
  { name: "bmw.ro", featured: true, labels: ["bmw.ro"], href: "https://www.bmw.ro/", year: 2008, about: { en: "Official site of BMW Romania, built in Flash with XML content", ro: "Site-ul oficial BMW România, în Flash, cu conținut din XML" }, skills: ["xml", "html", "flash"] },
  { name: "vibefm.ro", href: "https://vibefm.ro/", year: 2008, about: { en: "Vibe FM, a dance-music radio network", ro: "Site-ul Vibe FM, rețea de radio cu muzică dance" }, skills: ["html", "css"] },
  { name: "sportlaminut.ro", year: 2009, about: { en: "Sports news, mostly football", ro: "Știri sportive, mai ales fotbal" }, skills: ["html", "css"] },
  { name: "creativeweek.org", year: 2009, about: { en: "A web designer’s blog and portfolio", ro: "Blogul și portofoliul unui web designer" }, skills: ["wordpress", "php", "html", "css"] },
  { name: "greenblog.descopera.ro", year: 2009, about: { en: "Environment blog of Descoperă magazine", ro: "Blogul de mediu al revistei Descoperă" }, skills: ["wordpress", "php", "html", "css"] },
  { name: "blog.provideo.ro", year: 2009, about: { en: "Movie blog of the Pro Video DVD label", ro: "Blogul de filme al Pro Video" }, skills: ["wordpress", "php", "html", "css"] },
  { name: "intrefete.ro", year: 2010, about: { en: "Women’s lifestyle site", ro: "Site de lifestyle pentru femei" }, skills: ["html", "css"] },
  { name: "m.apropoid.ro", year: 2010, about: { en: "Mobile sign-in for Apropo accounts", ro: "Autentificare pe mobil în contul Apropo" }, skills: ["html", "css"] },
  { name: "prosport.ro - v2010", year: 2010, about: { en: "ProSport, a national sports daily", ro: "Site-ul ProSport, cotidian sportiv național" }, skills: ["html", "css"] },
  { name: "soferderomania.promotor.ro - v2010", year: 2010, about: { en: "Online driving game by Promotor and Opel", ro: "Joc online de condus, de la Promotor și Opel" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "liga.prosport.ro - v2010", year: 2010, about: { en: "ProSport’s fantasy football game", ro: "Jocul de fantasy football ProSport" }, skills: ["html", "css"] },
  { name: "fratelli.ro", href: "https://fratelli.ro/", year: 2011, about: { en: "Fratelli, Bucharest nightclubs and social events", ro: "Site-ul Fratelli, cluburi și evenimente din București" }, skills: ["html", "css"] },
  { name: "one.ro", year: 2011, about: { en: "Fashion site of ONE magazine", ro: "Site-ul de modă al revistei ONE" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "descopera.ro", featured: true, href: "https://www.descopera.ro/", year: 2011, about: { en: "Descoperă, a science magazine", ro: "Site-ul revistei de știință Descoperă" }, skills: ["html", "css", "jQuery"] },
  { name: "orlando.ro - v2011", href: "https://www.orlando.ro/", year: 2011, about: { en: "Orlando Nicoară’s blog on internet and media", ro: "Blogul lui Orlando Nicoară despre internet și media" }, skills: ["html", "css", "wordpress", "php"] },
  { name: "storageroom.ro", year: 2011, about: { en: "Storage Room, a bar", ro: "Site-ul barului Storage Room" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "oanacuzino.csid.ro", year: 2011, about: { en: "Health blog of TV doctor Oana Cuzino", ro: "Blogul de sănătate al doctoriței Oana Cuzino" }, skills: ["wordpress", "php", "html", "css", "javascript"] },
  { name: "thecitybreak.ro", year: 2011, about: { en: "Guide to European city breaks", ro: "Ghid de city break-uri în Europa" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "m.apropo.ro", year: 2011, about: { en: "Mobile site of the Apropo portal", ro: "Site-ul de mobil al portalului Apropo" }, skills: ["html", "css"] },
  { name: "m.ro", href: "https://www.m.ro/", year: 2011, about: { en: "Corporate site of Mediafax Group", ro: "Site-ul corporate al Mediafax Group" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "alo-moda.ro", year: 2011, about: { en: "AloModa fashion blog", ro: "Blogul de modă AloModa" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "businessdevelopment.ro", year: 2012, about: { en: "Business consulting firm", ro: "Firmă de consultanță în afaceri" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "liga.prosport.ro", year: 2012, about: { en: "ProSport’s fantasy football game", ro: "Jocul de fantasy football ProSport" }, skills: ["html", "css", "jQuery"] },
  { name: "gq.ro", year: 2012, about: { en: "GQ Romania, the men’s magazine", ro: "Site-ul revistei pentru bărbați GQ România" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "cineconduce.promotor.ro", year: 2012, about: { en: "Driving contest by Promotor and Opel", ro: "Concurs auto, de la Promotor și Opel" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "travel.descopera.ro", year: 2012, about: { en: "Travel section of Descoperă magazine", ro: "Secțiunea de călătorii a revistei Descoperă" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "afiliere.mobilio.ro", year: 2012, about: { en: "Sign-up for the Mobilio mobile ad network", ro: "Înscriere în rețeaua de reclame mobile Mobilio" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "bound.ro", href: "https://bound.ro/", year: 2013, about: { en: "Bound, a club in Bucharest", ro: "Site-ul clubului Bound din București" }, skills: ["wordpress", "php", "html", "css", "jQuery", "javascript"] },
  { name: "tortionari.gandul.info", year: 2013, about: { en: "Gândul report on communist-era torturers", ro: "Investigația Gândul despre torționarii comuniști" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "prosport.ro", featured: true, href: "https://www.prosport.ro/", year: 2013, about: { en: "ProSport, a national sports daily", ro: "Site-ul ProSport, cotidian sportiv național" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "autopro.ro", href: "https://autopro.ro/", nofollow: true, year: 2013, about: { en: "AutoPro, a car magazine", ro: "Site-ul revistei auto AutoPro" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "tirbuson.ro", year: 2013, about: { en: "Wine club and online wine shop", ro: "Club de vinuri și magazin online" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "csid.ro", href: "https://www.csid.ro/", year: 2013, about: { en: "Women’s health and lifestyle magazine", ro: "Revistă de sănătate și lifestyle pentru femei" }, skills: ["html", "css", "jQuery", "javascript"] },
  { name: "criserb.com", href: "https://www.criserb.com/blog/", year: 2013, about: { en: "Personal blog of Romanian blogger Cristi Șerb", ro: "Blogul personal al bloggerului Cristi Șerb" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "nush.ro", href: "https://nush.ro/", year: 2014, about: { en: "Q&A community", ro: "Comunitate de întrebări și răspunsuri" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "cabral.ro", href: "https://www.cabral.ro/", year: 2014, about: { en: "Blog of TV presenter and actor Cabral Ibacka", ro: "Blogul prezentatorului TV și actorului Cabral Ibacka" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "apropotv.ro", href: "https://www.apropotv.ro/", year: 2014, about: { en: "TV guide and entertainment news", ro: "Ghid TV și știri de divertisment" }, skills: ["html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "practica-ta.ro", year: 2014, about: { en: "Student internship platform by Adecco", ro: "Platformă de stagii pentru studenți, de la Adecco" }, skills: ["wordpress", "php", "mysql", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "ozinparis.com", href: "https://ozinparis.com/", year: 2015, about: { en: "Fashion and travel blog OZ in Paris", ro: "Blogul de modă și călătorii OZ in Paris" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript"] },
  { name: "caloria.ro", href: "https://www.caloria.ro/", year: 2015, about: { en: "Diet and nutrition site", ro: "Site despre dietă și nutriție" }, skills: ["html", "css", "less", "bootstrap", "jQuery", "javascript"] },
  { name: "andreeaibacka.ro", href: "https://andreeaibacka.ro/", year: 2015, about: { en: "Personal site of actress Andreea Ibacka", ro: "Site-ul personal al actriței Andreea Ibacka" }, skills: ["wordpress", "php", "html", "css", "less", "bootstrap", "jQuery", "javascript", "nodejs"] },
  { name: "republica.ro", featured: true, href: "https://republica.ro/", year: 2015, about: { en: "Opinion platform with columns by public figures and experts", ro: "Platformă de opinie cu texte semnate de oameni publici și experți" }, skills: ["html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "git", "PM"] },
  { name: "suntmamica.ro", href: "https://www.suntmamica.ro/", year: 2016, about: { en: "Parenting site and community for mothers", ro: "Site și comunitate pentru mame" }, skills: ["html", "php", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp", "git"] },
  { name: "gobet.ro", year: 2016, about: { en: "GOBet, a sports betting operator", ro: "Site-ul casei de pariuri GOBet" }, skills: ["html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp"] },
  { name: "basilica.ro", href: "https://basilica.ro/", year: 2016, about: { en: "News agency of the Romanian Patriarchate", ro: "Agenția de știri a Patriarhiei Române" }, skills: ["wordpress", "php", "html", "css", "sass", "bootstrap", "jQuery", "javascript", "vagrant", "nodejs", "gulp", "git"] },
  { name: "digi24.ro", featured: true, labels: ["digi24.ro"], href: "https://www.digi24.ro/", year: 2016, about: { en: "Mobile and desktop sites for the Digi24 news channel", ro: "Site-ul televiziunii de știri Digi24, mobil și desktop" }, skills: ["html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp", "git"] },
  { name: "kanald.ro", featured: true, href: "https://www.kanald.ro/", year: 2017, about: { en: "Kanal D, a TV channel", ro: "Site-ul televiziunii Kanal D" }, skills: ["html", "css", "sass", "bootstrap", "javascript", "nodejs", "gulp", "vagrant", "git"] },
  { name: "gaseste.ro", href: "https://www.gaseste.ro/", year: 2017, about: { en: "Marketplace for local service providers", ro: "Platformă pentru servicii locale" }, skills: ["php", "html", "css", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "gulp", "vagrant", "git", "PM"] },
  { name: "vreaudeviz.ro", year: 2017, about: { en: "Online quotes for home renovation", ro: "Devize online pentru renovări" }, skills: ["html", "css", "sass", "bootstrap", "vue.js", "javascript", "nodejs", "gulp"] },
  { name: "trinitas.tv", featured: true, href: "https://www.trinitas.tv/", year: 2017, about: { en: "Trinitas TV, the Patriarchate’s TV channel", ro: "Site-ul Trinitas TV, televiziunea Patriarhiei" }, skills: ["wordpress", "php", "mysql", "sass", "bootstrap", "jQuery", "javascript", "nodejs", "webpack", "gulp", "vagrant", "git", "ci", "cd"] },
  { name: "ROdiaspora", href: "http://ithub.gov.ro/2016/12/09/rodiaspora/", year: 2017, about: { en: "Mobile app for Romanians abroad", ro: "Aplicație mobilă pentru românii din diaspora" }, skills: ["angular", "rxjs", "ionic", "typescript", "javascript", "cordova"] },
  { name: "iaa.ro", href: "https://iaa.ro/", year: 2018, about: { en: "Romanian chapter of the IAA advertising association", ro: "Filiala română a asociației de publicitate IAA" }, skills: ["wordpress", "php", "html", "css", "sass", "bootstrap", "jQuery", "javascript", "webpack", "gulp", "nodejs", "git"] },
];
