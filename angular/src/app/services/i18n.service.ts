import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'hu';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    /* NAV */
    'nav.services': 'Services', 'nav.process': 'Process', 'nav.work': 'Work',
    'nav.contact': 'Contact', 'nav.cta': 'Start Project',

    /* HERO */
    'hero.badge': 'Available for new projects · 2026',
    'hero.sub': 'Full-service web studio specialising in high-performance design, security hardening, and SEO growth — built to make your brand impossible to ignore.',
    'hero.cta1': 'View Our Work', 'hero.cta2': 'Get a Free Audit', 'hero.scroll': 'Scroll',

    /* SERVICES */
    'services.label': 'What we do',
    'services.sub': 'From pixel-perfect interfaces to bulletproof security — we handle every layer of your digital presence.',
    's1.title': 'Web Design & Development',
    's1.desc': 'Stunning, conversion-focused websites engineered for speed and crafted with obsessive attention to detail.',
    's1.f1': 'Custom UI / UX Design', 's1.f2': 'Responsive & mobile-first', 's1.f5': 'CMS & e-commerce integration',
    's2.title': 'SEO & Growth',
    's2.desc': 'Data-driven strategies that push you to the top of search results and keep you there sustainably.',
    's2.f1': 'Technical SEO audit', 's2.f2': 'Keyword research & strategy',
    's2.f3': 'On-page & schema markup', 's2.f4': 'Link building campaigns', 's2.f5': 'Monthly reporting',
    's3.title': 'Brand Identity',
    's3.desc': 'Visual identities that communicate your values instantly and build lasting recognition in any market.',
    's3.f1': 'Logo & visual identity', 's3.f2': 'Design system creation',
    's3.f3': 'Brand guidelines', 's3.f4': 'Motion & animation', 's3.f5': 'Print & digital assets',

    /* STATS */
    'stats.p1': 'Projects delivered', 'stats.p2': 'Client satisfaction',
    'stats.p3': 'In the industry', 'stats.p4': 'Revenue generated for clients',

    /* PROCESS */
    'process.label': 'How we work', 'process.title': 'Simple, proven process',
    'process.sub': 'From first call to launch in four clear steps — no surprises, no drama.',
    'process.s1.title': 'Discovery', 'process.s1.desc': 'Deep-dive into your goals, audience, and competition to build a rock-solid strategy.',
    'process.s2.title': 'Design', 'process.s2.desc': 'Wireframes → high-fidelity mockups → interactive prototype. You approve every pixel.',
    'process.s3.title': 'Build & Audit', 'process.s3.desc': 'Development alongside security and SEO audits baked in — not bolted on afterwards.',
    'process.s4.title': 'Launch & Grow', 'process.s4.desc': 'Smooth deployment, post-launch monitoring, and continuous improvement to keep you ahead.',

    /* PORTFOLIO */
    'portfolio.label': 'Selected work', 'portfolio.title': "Projects we're proud of",
    'tag.web': 'Web Design', 'tag.brand': 'Brand Identity', 'tag.seo': 'SEO',

    /* CONTACT / RESPONSE */
    'contact.label': 'Get in touch', 'contact.title': "Let's build something great",
    'contact.desc': "Tell us about your project. We'll get back to you within one business day with a clear plan and honest quote.",
    'contact.email.label': 'Email', 'contact.location.label': 'Location',
    'contact.location.value': 'Remote — serving clients worldwide',
    'contact.response.label': 'Response time', 'contact.response.value': 'Within one business day',

    /* PRICING SECTION */
    'pricing.label': 'Pricing',
    'pricing.title1': 'Custom pricing.',
    'pricing.title.accent': 'Free',
    'pricing.title2': 'consultation.',
    'pricing.desc': 'Every project is different — that\'s why we don\'t offer cookie-cutter packages. Prices are tailored to real needs. The first consultation is completely free, no strings attached.',
    'pricing.perk1': 'Free first consultation',
    'pricing.perk2': 'Custom, itemized quote',
    'pricing.perk3': 'No hidden fees',
    'pricing.perk4': 'Flexible payment terms',
    'pricing.card.label': 'Fill out the design brief',
    'pricing.card.title1': 'We know exactly',
    'pricing.card.title2': 'what you want.',
    'pricing.card.desc': 'A few questions about design — colors, style, layout, everything. Done in 5 minutes, and we\'ll immediately know how to help.',
    'pricing.card.step1': 'Fill out the design brief',
    'pricing.card.step2': 'Free consultation scheduling',
    'pricing.card.step3': 'Custom quote within 24 hours',
    'pricing.card.cta': 'Start your project',
    'pricing.card.note': 'Free · No obligation · ~5 min',

    /* BRIEF MODAL — HEADER / NAV */
    'brief.header.summary': 'Summary',
    'brief.header.done': 'DONE',
    'brief.nav.next': 'Next →',
    'brief.nav.back': '← Back',
    'brief.nav.skip': 'Skip',
    'brief.nav.finish': 'See the summary',

    /* BRIEF — STEP 0 */
    'brief.s0.title': 'Project basics',
    'brief.s0.desc': 'Tell us a bit about your project.',
    'brief.s0.name': 'Project / company name',
    'brief.s0.name.ph': 'e.g. Acme Corp',
    'brief.s0.type': 'What type of website do you want?',
    'brief.s0.industry': 'Which industry?',
    'brief.s0.industry.ph': 'e.g. Healthcare, IT, Real estate…',
    'brief.s0.goal': 'What is the main goal of the site?',

    /* BRIEF — STEP 1 */
    'brief.s1.title': 'Current website',
    'brief.s1.desc': 'If you already have a website, share the link — I\'ll use it as a reference for the quote.',
    'brief.s1.optional': '(Optional)',
    'brief.s1.url': 'Website URL',
    'brief.s1.url.ph': 'https://www.example.com',
    'brief.s1.hint': 'Don\'t have a site yet? Click "Skip".',

    /* BRIEF — STEP 2 */
    'brief.s2.title': 'Target audience',
    'brief.s2.desc': 'Who is the site for?',
    'brief.s2.audience': 'Who is your target audience?',
    'brief.s2.audience.ph': 'e.g. Small business owners aged 30–50 who…',
    'brief.s2.segment': 'Market segment',
    'brief.s2.message': 'What one sentence must the site communicate immediately?',
    'brief.s2.message.ph': 'e.g. The fastest accounting software for SMBs',

    /* BRIEF — STEP 3 */
    'brief.s3.title': 'Technology',
    'brief.s3.desc': 'Do you know what frontend you want?',
    'brief.s3.optional': '(Optional)',
    'brief.s3.frontend': 'Preferred frontend',

    /* BRIEF — STEP 4 */
    'brief.s4.title': 'Brand & logo',
    'brief.s4.desc': 'Where are you with your visual identity?',
    'brief.s4.logo': 'Do you already have a logo?',
    'brief.s4.brand': 'Do you have a defined brand identity (colors, fonts, style)?',
    'brief.s4.brand.detail': 'Describe briefly (hex code, font name, etc.)',
    'brief.s4.brand.detail.ph': 'e.g. primary: #1a73e8, font: Nunito',

    /* BRIEF — STEP 5 */
    'brief.s5.title': 'Colors',
    'brief.s5.desc': 'If you\'re not sure, leave it off — I\'ll suggest colors in the quote.',
    'brief.s5.primary': 'Primary (main) color',
    'brief.s5.secondary': 'Secondary / background color',
    'brief.s5.know': 'I know it',
    'brief.s5.theme': 'Theme',
    'brief.s5.mood': 'What feeling should it evoke?',
    'brief.s5.mood.multi': '(multiple allowed)',

    /* BRIEF — STEP 6 */
    'brief.s6.title': 'Typography',
    'brief.s6.desc': 'What font style do you have in mind?',
    'brief.s6.style': 'Font character',
    'brief.s6.hu': 'Is support for accented Hungarian characters important?',

    /* BRIEF — STEP 7 */
    'brief.s7.title': 'Visual style',
    'brief.s7.desc': 'What mood should the site have?',
    'brief.s7.styles': 'Styles',
    'brief.s7.multi': '(multiple allowed)',
    'brief.s7.inspo': 'Show me 1–3 sites you like!',
    'brief.s7.inspo.hint': '(URLs, comma-separated)',
    'brief.s7.inspo.ph': 'linear.app, vercel.com, stripe.com',
    'brief.s7.dislike': 'Show me 1–2 sites you DON\'T like',
    'brief.s7.dislike.hint': '(optional)',
    'brief.s7.dislike.ph': 'e.g. example.com — too cluttered, outdated style',

    /* BRIEF — STEP 8 */
    'brief.s8.title': 'Layout & navigation',
    'brief.s8.desc': 'How should the site be structured?',
    'brief.s8.structure': 'Structure',
    'brief.s8.sections': 'Which sections do you need?',
    'brief.s8.sections.multi': '(multiple)',
    'brief.s8.nav.style': 'Navigation style',
    'brief.s8.scroll': 'Are scroll animations / parallax important?',

    /* BRIEF — STEP 9 */
    'brief.s9.title': 'Images & media',
    'brief.s9.desc': 'What visual assets do you have?',
    'brief.s9.photos': 'Do you have your own photo assets?',
    'brief.s9.video': 'Is a video background or embed needed?',
    'brief.s9.icons': 'What icon style do you prefer?',

    /* BRIEF — STEP 10 */
    'brief.s10.title': 'Animation level',
    'brief.s10.desc': 'How lively and interactive should the site be?',

    /* BRIEF — STEP 11 */
    'brief.s11.title': 'Special features',
    'brief.s11.desc': 'Do you need any of these?',
    'brief.s11.multi': '(multiple allowed)',

    /* BRIEF — STEP 12 */
    'brief.s12.title': 'Content & deadline',
    'brief.s12.desc': 'Just a few more questions.',
    'brief.s12.copy': 'Do you have the written content (copy)?',
    'brief.s12.images': 'Do you have the image assets?',
    'brief.s12.deadline': 'Deadline',
    'brief.s12.deadline.hint': '(optional)',
    'brief.s12.deadline.ph': 'e.g. August 2026, or: no fixed deadline',
    'brief.s12.must': 'Is there anything that must be included?',
    'brief.s12.must.ph': 'e.g. awards, press mentions, specific section…',
    'brief.s12.avoid': 'Is there anything that must be avoided?',
    'brief.s12.avoid.ph': 'e.g. flashing animations, more than 3 colors, etc.',

    /* BRIEF — STEP 13 (SUMMARY) */
    'brief.s13.title': 'Design Brief complete!',
    'brief.s13.desc': 'Copy this text into a Claude.ai conversation to start designing immediately. I\'ll also receive your details — I\'ll be in touch soon.',
    'brief.s13.copy': 'Copy brief',
    'brief.s13.copied': 'Copied!',
    'brief.s13.consult': 'Book consultation →',

    /* FOOTER */
    'footer.desc': 'Premium web design, security analysis, and SEO services. We make digital experiences that work as hard as you do.',
    'footer.col1': 'Services', 'footer.col2': 'Company', 'footer.process': 'Our Process',
    'footer.work': 'Our Work', 'footer.col3': 'Legal',
    'footer.privacy': 'Privacy Policy', 'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    'footer.copy': '© 2026 LionDesign Studio. All rights reserved.',
    'footer.built': 'Designed & built by LionDesign',
  },

  hu: {
    /* NAV */
    'nav.services': 'Szolgáltatások', 'nav.process': 'Folyamat', 'nav.work': 'Munkáink',
    'nav.contact': 'Kapcsolat', 'nav.cta': 'Projekt indítása',

    /* HERO */
    'hero.badge': 'Elérhető új projektekre · 2026',
    'hero.sub': 'Teljes körű webstúdió, magas teljesítményű design, biztonsági erősítés és SEO növekedés specialistái — azért, hogy márkád ne legyen figyelmen kívül hagyható.',
    'hero.cta1': 'Munkáink', 'hero.cta2': 'Ingyenes audit', 'hero.scroll': 'Görgetés',

    /* SERVICES */
    'services.label': 'Mit csinálunk',
    'services.sub': 'Pixel-tökéletes felületektől a golyóálló biztonságig — az online jelenléted minden rétegét kezeljük.',
    's1.title': 'Webdesign és fejlesztés',
    's1.desc': 'Lenyűgöző, konverzióra optimalizált weboldalak, sebességre tervezve és megszállott részletességgel kivitelezve.',
    's1.f1': 'Egyedi UI / UX tervezés', 's1.f2': 'Reszponzív és mobilbarát', 's1.f5': 'CMS és e-kereskedelmi integráció',
    's2.title': 'SEO és növekedés',
    's2.desc': 'Adatvezérelt stratégiák, amelyek a keresési rangsor elejére tolnak, és ott tartanak fenntarthatóan.',
    's2.f1': 'Technikai SEO audit', 's2.f2': 'Kulcsszókutatás és stratégia',
    's2.f3': 'On-page és séma jelölés', 's2.f4': 'Linképítési kampányok', 's2.f5': 'Havi jelentések',
    's3.title': 'Márkaidentitás',
    's3.desc': 'Vizuális identitások, amelyek azonnal kommunikálják az értékeidet és tartós felismerhetőséget építenek.',
    's3.f1': 'Logó és vizuális identitás', 's3.f2': 'Dizájnrendszer alkotás',
    's3.f3': 'Márka arculati kézikönyv', 's3.f4': 'Mozgás és animáció', 's3.f5': 'Nyomtatott és digitális anyagok',

    /* STATS */
    'stats.p1': 'Elkészített projekt', 'stats.p2': 'Ügyfélelégedettség',
    'stats.p3': 'Iparági tapasztalat', 'stats.p4': 'Ügyfeleknek generált bevétel',

    /* PROCESS */
    'process.label': 'Hogyan dolgozunk', 'process.title': 'Egyszerű, bevált folyamat',
    'process.sub': 'Az első hívástól az indításig négy egyértelmű lépésben — meglepetések és dráma nélkül.',
    'process.s1.title': 'Felfedezés', 'process.s1.desc': 'Mélyreható elemzés a céljaidról, közönségedről és versenytársaidról, hogy szilárd stratégiát építsünk.',
    'process.s2.title': 'Tervezés', 'process.s2.desc': 'Drótváz → részletes mockup → interaktív prototípus. Te hagyod jóvá minden pixelt.',
    'process.s3.title': 'Fejlesztés és audit', 'process.s3.desc': 'Fejlesztés biztonsági és SEO auditokkal párhuzamosan — nem utólag rárakva.',
    'process.s4.title': 'Indítás és növekedés', 'process.s4.desc': 'Zökkenőmentes üzembe helyezés, indítás utáni monitorozás és folyamatos fejlesztés, hogy megtartsd az előnyöd.',

    /* PORTFOLIO */
    'portfolio.label': 'Kiválasztott munkák', 'portfolio.title': 'Büszke projektjeink',
    'tag.web': 'Webdesign', 'tag.brand': 'Márkaidentitás', 'tag.seo': 'SEO',

    /* CONTACT / RESPONSE */
    'contact.label': 'Lépj kapcsolatba', 'contact.title': 'Építsünk valami nagyszerűt',
    'contact.desc': 'Mesélj a projektedről. Egy munkanapon belül visszajelzünk egyértelmű tervvel és becsületes árajánlattal.',
    'contact.email.label': 'E-mail', 'contact.location.label': 'Helyszín',
    'contact.location.value': 'Távoli — worldwide ügyfeleket szolgálunk',
    'contact.response.label': 'Válaszidő', 'contact.response.value': 'Egy munkanapon belül',

    /* PRICING SECTION */
    'pricing.label': 'Árazás',
    'pricing.title1': 'Egyedi ár.',
    'pricing.title.accent': 'Ingyenes',
    'pricing.title2': 'konzultáció.',
    'pricing.desc': 'Minden projekt más — ezért nem kínálunk dobozos csomagokat. Az árakat a valódi igények alapján szabjuk. Az első konzultáció teljesen ingyenes, semmihez nem köt.',
    'pricing.perk1': 'Ingyenes első konzultáció',
    'pricing.perk2': 'Egyedi, tételes ajánlat',
    'pricing.perk3': 'Nincsenek rejtett díjak',
    'pricing.perk4': 'Rugalmas fizetési feltételek',
    'pricing.card.label': 'Töltsd ki a design briefet',
    'pricing.card.title1': 'Pontosan tudjuk,',
    'pricing.card.title2': 'mit szeretnél.',
    'pricing.card.desc': 'Pár kérdés a designról — szín, stílus, elrendezés, minden. 5 perc alatt kész, és azonnal látjuk, hogyan segíthetünk.',
    'pricing.card.step1': 'Töltsd ki a design briefet',
    'pricing.card.step2': 'Ingyenes konzultáció egyeztetés',
    'pricing.card.step3': 'Egyedi ajánlat 24 órán belül',
    'pricing.card.cta': 'Indítsd el a projekted',
    'pricing.card.note': 'Ingyenes · Kötelezettség nélkül · ~5 perc',

    /* BRIEF MODAL — HEADER / NAV */
    'brief.header.summary': 'Összefoglaló',
    'brief.header.done': 'KÉSZ',
    'brief.nav.next': 'Következő →',
    'brief.nav.back': '← Vissza',
    'brief.nav.skip': 'Kihagyom',
    'brief.nav.finish': 'Megnézem az összefoglalót',

    /* BRIEF — STEP 0 */
    'brief.s0.title': 'Projekt alapadatok',
    'brief.s0.desc': 'Mesélj egy kicsit a projektedről.',
    'brief.s0.name': 'Projekt / cég neve',
    'brief.s0.name.ph': 'pl. Kovács Kft',
    'brief.s0.type': 'Milyen típusú weboldalt szeretnél?',
    'brief.s0.industry': 'Melyik iparágban?',
    'brief.s0.industry.ph': 'pl. Egészségügy, IT, Ingatlan…',
    'brief.s0.goal': 'Mi az oldal fő célja?',

    /* BRIEF — STEP 1 */
    'brief.s1.title': 'Jelenlegi weboldal',
    'brief.s1.desc': 'Ha van már weboldalad, add meg a linkjét — referenciaként használom az ajánlatnál.',
    'brief.s1.optional': '(Kihagyható)',
    'brief.s1.url': 'Weboldal URL',
    'brief.s1.url.ph': 'https://www.pelda.hu',
    'brief.s1.hint': 'Nincs még oldalad? Kattints a "Kihagyom" gombra.',

    /* BRIEF — STEP 2 */
    'brief.s2.title': 'Célközönség',
    'brief.s2.desc': 'Kinek szól az oldal?',
    'brief.s2.audience': 'Kik a célközönséged?',
    'brief.s2.audience.ph': 'pl. 30-50 éves kisvállalkozók, akik…',
    'brief.s2.segment': 'Piaci szegmens',
    'brief.s2.message': 'Mi az az egy mondat, amit az oldalnak azonnal közvetítenie kell?',
    'brief.s2.message.ph': 'pl. A leggyorsabb könyvelő szoftver KKV-knak',

    /* BRIEF — STEP 3 */
    'brief.s3.title': 'Technológia',
    'brief.s3.desc': 'Tudod-e milyen frontendet szeretnél?',
    'brief.s3.optional': '(Kihagyható)',
    'brief.s3.frontend': 'Preferred frontend',

    /* BRIEF — STEP 4 */
    'brief.s4.title': 'Márka & logó',
    'brief.s4.desc': 'Hol tartasz a vizuális azonossággal?',
    'brief.s4.logo': 'Van már logód?',
    'brief.s4.brand': 'Van meghatározott brand identity (szín, betű, stílus)?',
    'brief.s4.brand.detail': 'Írd le röviden (meglévő színkód, betűtípus neve, stb.)',
    'brief.s4.brand.detail.ph': 'pl. elsődleges szín: #1a73e8, betű: Nunito',

    /* BRIEF — STEP 5 */
    'brief.s5.title': 'Színek',
    'brief.s5.desc': 'Ha nem tudod pontosan, hagyd kikapcsolva — az ajánlatban javaslatot adok.',
    'brief.s5.primary': 'Elsődleges (fő) szín',
    'brief.s5.secondary': 'Másodlagos / háttér szín',
    'brief.s5.know': 'Tudom',
    'brief.s5.theme': 'Téma',
    'brief.s5.mood': 'Milyen érzést kell keltenie?',
    'brief.s5.mood.multi': '(több is választható)',

    /* BRIEF — STEP 6 */
    'brief.s6.title': 'Tipográfia',
    'brief.s6.desc': 'Milyen betűstílust képzelsz el?',
    'brief.s6.style': 'Betűtípus karaktere',
    'brief.s6.hu': 'Fontos az ékezetes magyar karakterek támogatása?',

    /* BRIEF — STEP 7 */
    'brief.s7.title': 'Vizuális stílus',
    'brief.s7.desc': 'Milyen hangulatú legyen az oldal?',
    'brief.s7.styles': 'Stílusok',
    'brief.s7.multi': '(több is választható)',
    'brief.s7.inspo': 'Mutass 1-3 oldalt ami tetszik!',
    'brief.s7.inspo.hint': '(URL-ek, vesszővel elválasztva)',
    'brief.s7.inspo.ph': 'linear.app, vercel.com, stripe.com',
    'brief.s7.dislike': 'Mutass 1-2 oldalt ami NEM tetszik',
    'brief.s7.dislike.hint': '(opcionális)',
    'brief.s7.dislike.ph': 'pl. valami.hu — túl zsúfolt, régi stílus',

    /* BRIEF — STEP 8 */
    'brief.s8.title': 'Elrendezés & navigáció',
    'brief.s8.desc': 'Hogyan épüljön fel az oldal?',
    'brief.s8.structure': 'Struktúra',
    'brief.s8.sections': 'Milyen szekciók kellenek?',
    'brief.s8.sections.multi': '(több is)',
    'brief.s8.nav.style': 'Navigáció stílusa',
    'brief.s8.scroll': 'Görgetési animáció / parallax fontos?',

    /* BRIEF — STEP 9 */
    'brief.s9.title': 'Képek & média',
    'brief.s9.desc': 'Milyen vizuális anyag áll rendelkezésre?',
    'brief.s9.photos': 'Van saját fotóanyagod?',
    'brief.s9.video': 'Kell videó háttér vagy beágyazás?',
    'brief.s9.icons': 'Milyen ikonstílus tetszik?',

    /* BRIEF — STEP 10 */
    'brief.s10.title': 'Animációk szintje',
    'brief.s10.desc': 'Mennyire legyen élénk, interaktív az oldal?',

    /* BRIEF — STEP 11 */
    'brief.s11.title': 'Speciális funkciók',
    'brief.s11.desc': 'Kell-e valami ezek közül?',
    'brief.s11.multi': '(több is választható)',

    /* BRIEF — STEP 12 */
    'brief.s12.title': 'Tartalom & határidő',
    'brief.s12.desc': 'Utolsó pár kérdés.',
    'brief.s12.copy': 'Megvan a szöveges tartalom (copy)?',
    'brief.s12.images': 'Megvan a képanyag?',
    'brief.s12.deadline': 'Határidő',
    'brief.s12.deadline.hint': '(opcionális)',
    'brief.s12.deadline.ph': 'pl. 2026 augusztus, vagy: nincs fix határidő',
    'brief.s12.must': 'Van valami amit mindenképpen bele kell emelni?',
    'brief.s12.must.ph': 'pl. díjak, sajtómegjelenések, konkrét szekció…',
    'brief.s12.avoid': 'Van valami amit mindenképpen kerülni kell?',
    'brief.s12.avoid.ph': 'pl. villogó animációk, több mint 3 szín, stb.',

    /* BRIEF — STEP 13 (SUMMARY) */
    'brief.s13.title': 'Design Brief kész!',
    'brief.s13.desc': 'Másold be ezt a szöveget egy Claude.ai beszélgetésbe, és azonnal elkezdheted a design tervezést. Én is megkapom az adataid — hamarosan felveszem veled a kapcsolatot.',
    'brief.s13.copy': 'Brief másolása',
    'brief.s13.copied': 'Másolva!',
    'brief.s13.consult': 'Konzultáció foglalása →',

    /* FOOTER */
    'footer.desc': 'Prémium webdesign, biztonsági elemzés és SEO szolgáltatások. Olyan digitális élményeket alkotunk, amelyek olyan keményen dolgoznak, mint te.',
    'footer.col1': 'Szolgáltatások', 'footer.col2': 'Cég', 'footer.process': 'Folyamatunk',
    'footer.work': 'Munkáink', 'footer.col3': 'Jogi',
    'footer.privacy': 'Adatvédelmi irányelvek', 'footer.terms': 'Felhasználási feltételek',
    'footer.cookies': 'Cookie irányelvek',
    'footer.copy': '© 2026 LionDesign Studio. Minden jog fenntartva.',
    'footer.built': 'Tervezte és fejlesztette a LionDesign',
  }
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  lang = signal<Lang>('en');
  t = computed(() => TRANSLATIONS[this.lang()]);

  constructor() {
    const saved = (localStorage.getItem('lang') as Lang) || 'en';
    this.lang.set(saved);
  }

  toggle() {
    this.lang.update(l => l === 'en' ? 'hu' : 'en');
    localStorage.setItem('lang', this.lang());
  }
}
