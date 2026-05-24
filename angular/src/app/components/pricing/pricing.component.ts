import { Component, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pricing.component.html',
})
export class PricingComponent {
  i18n = inject(I18nService);

  modalOpen = false;
  currentStep = 0;
  sendStatus: 'idle' | 'sending' | 'sent' | 'error' = 'idle';
  readonly TOTAL_STEPS = 13;
  readonly stepRange = Array.from({ length: this.TOTAL_STEPS }, (_, i) => i);

  brief = {
    projectName: '',
    siteType: '',
    industry: '',
    goal: '',
    currentSiteUrl: '',
    audience: '',
    b2b: '',
    keyMessage: '',
    frontend: '',
    hasLogo: '',
    hasBrand: '',
    brandDetails: '',
    primaryColorKnown: false,
    primaryColor: '#f59e0b',
    secondaryColorKnown: false,
    secondaryColor: '#171717',
    theme: '',
    mood: [] as string[],
    fontStyle: '',
    needsHungarian: '',
    visualStyles: [] as string[],
    inspirationUrls: '',
    dislikedUrls: '',
    pageStructure: '',
    sections: [] as string[],
    navStyle: '',
    scrollAnimations: '',
    hasPhotos: '',
    needsVideo: '',
    iconStyle: '',
    animationLevel: '',
    features: [] as string[],
    hasCopy: '',
    hasImages: '',
    deadline: '',
    mustHave: '',
    mustAvoid: '',
  };

  /* ── Translated option arrays ── */
  siteTypes = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      'Landing page',
      hu ? 'Cégweboldal' : 'Company website',
      'Portfolio',
      'Webshop',
      'SaaS',
      'Blog',
      hu ? 'Egyéb' : 'Other',
    ];
  });

  goals = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Értékesítés' : 'Sales',
      hu ? 'Lead gyűjtés' : 'Lead generation',
      hu ? 'Bemutatkozás' : 'Introduction',
      hu ? 'Foglalás' : 'Booking',
      hu ? 'Közösségépítés' : 'Community building',
      hu ? 'Egyéb' : 'Other',
    ];
  });

  b2bOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'B2B — cégeknek' : 'B2B — for businesses',
      hu ? 'B2C — magánszemélyeknek' : 'B2C — for individuals',
      hu ? 'Mindkettő' : 'Both',
    ];
  });

  frontends = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return ['React', 'Next.js', 'Angular', 'Vue / Nuxt', 'Webflow', 'WordPress',
      hu ? 'Nincs preferencia' : 'No preference'];
  });

  logoOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Igen, kész logó' : 'Yes, finished logo',
      hu ? 'Nincs logó' : 'No logo',
      hu ? 'Készül / tervezés alatt' : 'In progress / being designed',
    ];
  });

  brandOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Igen, teljesen kész' : 'Yes, fully defined',
      hu ? 'Részben megvan' : 'Partially defined',
      hu ? 'Nincs, kell segítség' : 'No, need help',
    ];
  });

  themeOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Sötét (dark)' : 'Dark',
      hu ? 'Világos (light)' : 'Light',
      hu ? 'Mindkettő (toggle)' : 'Both (toggle)',
    ];
  });

  moodOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Luxus' : 'Luxury',
      hu ? 'Bizalom' : 'Trust',
      hu ? 'Energia' : 'Energy',
      hu ? 'Barátságos' : 'Friendly',
      'Tech',
      hu ? 'Prémium' : 'Premium',
      hu ? 'Kreatív' : 'Creative',
      hu ? 'Természetes' : 'Natural',
      hu ? 'Szakmai' : 'Professional',
    ];
  });

  fontStyles = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      {
        key: 'Modern sans-serif',
        label: 'Modern sans-serif',
        desc: hu ? 'Inter, Geist, DM Sans — tiszta, mai, digitális' : 'Inter, Geist, DM Sans — clean, modern, digital',
      },
      {
        key: hu ? 'Klasszikus serif' : 'Classic serif',
        label: hu ? 'Klasszikus serif' : 'Classic serif',
        desc: hu ? 'Playfair, Lora — elegáns, presztízsjelző' : 'Playfair, Lora — elegant, prestigious',
      },
      {
        key: hu ? 'Display / kézírásos' : 'Display / handwritten',
        label: hu ? 'Display / kézírásos' : 'Display / handwritten',
        desc: hu ? 'Kreatív, egyedi, személyes hang' : 'Creative, unique, personal touch',
      },
      {
        key: 'Monospace',
        label: 'Monospace',
        desc: hu ? 'JetBrains Mono, Fira Code — tech, fejlesztői' : 'JetBrains Mono, Fira Code — tech, developer',
      },
      {
        key: hu ? 'Nincs preferencia' : 'No preference',
        label: hu ? 'Nincs preferencia' : 'No preference',
        desc: hu ? 'Javaslatot várok' : 'I\'ll take a suggestion',
      },
    ];
  });

  visualStyles = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      {
        key: hu ? 'Minimál' : 'Minimal',
        label: hu ? 'Minimál' : 'Minimal',
        desc: hu ? 'Sok whitespace, kevés elem, tiszta vonalak' : 'Lots of whitespace, few elements, clean lines',
      },
      {
        key: hu ? 'Bold / erős' : 'Bold / strong',
        label: hu ? 'Bold / erős' : 'Bold / strong',
        desc: hu ? 'Nagy betűk, kemény kontraszt, határozott identitás' : 'Big type, hard contrast, strong identity',
      },
      {
        key: hu ? 'Luxus / prémium' : 'Luxury / premium',
        label: hu ? 'Luxus / prémium' : 'Luxury / premium',
        desc: hu ? 'Sötét alap, arany/ezüst kiemelők, animált részletek' : 'Dark base, gold/silver accents, animated details',
      },
      {
        key: hu ? 'Játékos / kreatív' : 'Playful / creative',
        label: hu ? 'Játékos / kreatív' : 'Playful / creative',
        desc: hu ? 'Színes, animált, humoros, nem konvencionális' : 'Colorful, animated, humorous, unconventional',
      },
      {
        key: hu ? 'Korporatív / megbízható' : 'Corporate / trustworthy',
        label: hu ? 'Korporatív / megbízható' : 'Corporate / trustworthy',
        desc: hu ? 'Konzervatív, strukturált, bizalomkeltő' : 'Conservative, structured, confidence-inspiring',
      },
      {
        key: 'Tech / startup',
        label: 'Tech / startup',
        desc: hu ? 'Glow, gradient, dark mode, modern SaaS esztétika' : 'Glow, gradient, dark mode, modern SaaS aesthetic',
      },
    ];
  });

  pageStructures = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Egy hosszú landing page' : 'One long landing page',
      hu ? 'Több aloldal' : 'Multiple subpages',
      hu ? 'Mindkettő' : 'Both',
    ];
  });

  sectionOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      'Hero',
      hu ? 'Szolgáltatások' : 'Services',
      'Portfolio',
      hu ? 'Vélemények' : 'Testimonials',
      hu ? 'Árazás' : 'Pricing',
      'FAQ',
      'Blog',
      hu ? 'Kapcsolat' : 'Contact',
      hu ? 'Rólunk' : 'About us',
      hu ? 'Csapat' : 'Team',
      hu ? 'Statisztikák' : 'Stats',
    ];
  });

  navStyles = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Fix felső nav' : 'Fixed top nav',
      hu ? 'Oldalsáv' : 'Sidebar',
      'Hamburger-only',
      'Sticky + hamburger mobile',
    ];
  });

  scrollOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Igen, legyen' : 'Yes, include it',
      hu ? 'Nem szükséges' : 'Not needed',
      hu ? 'Nem fontos' : 'Not important',
    ];
  });

  photoOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Igen, kész fotók vannak' : 'Yes, photos are ready',
      hu ? 'Nincs, kell stock' : 'No, need stock photos',
      hu ? 'Nincs, kell fotózás' : 'No, need a photoshoot',
      hu ? 'Részben van' : 'Partially ready',
    ];
  });

  videoOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [hu ? 'Igen' : 'Yes', hu ? 'Nem' : 'No', hu ? 'Esetleg' : 'Maybe'];
  });

  iconOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Vonalak (outline)' : 'Outline',
      hu ? 'Tömör (filled)' : 'Filled',
      hu ? '3D / illustráció' : '3D / illustration',
      'Emoji',
      hu ? 'Nincs ikon' : 'No icons',
    ];
  });

  animLevels = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      {
        key: hu ? 'Semmi — statikus oldal' : 'None — static',
        label: hu ? 'Semmi — statikus' : 'None — static',
        desc: hu ? 'Gyors, egyszerű, maximális teljesítmény' : 'Fast, simple, maximum performance',
      },
      {
        key: hu ? 'Finom — scroll reveal, fade-in' : 'Subtle',
        label: hu ? 'Finom' : 'Subtle',
        desc: hu ? 'Scroll reveal, fade-in elemek — professzionális, visszafogott' : 'Scroll reveal, fade-in elements — professional, restrained',
      },
      {
        key: hu ? 'Közepes — hover effektek, transition-ök' : 'Medium',
        label: hu ? 'Közepes' : 'Medium',
        desc: hu ? 'Hover effektek, smooth transition-ök, némi interakció' : 'Hover effects, smooth transitions, some interaction',
      },
      {
        key: hu ? 'Gazdag — parallax, 3D, mikro-animációk' : 'Rich',
        label: hu ? 'Gazdag' : 'Rich',
        desc: hu ? 'Parallax, 3D, particle, micro-interactions — emlékezetes élmény' : 'Parallax, 3D, particle, micro-interactions — memorable experience',
      },
    ];
  });

  featureOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      'Webshop / checkout',
      'Blog / CMS',
      hu ? 'Foglalási rendszer' : 'Booking system',
      hu ? 'Többnyelvűség' : 'Multilanguage',
      'Dark / light mode',
      hu ? 'Interaktív kalkulátor' : 'Interactive calculator',
      'Quiz / configurator',
      hu ? 'Bejelentkező rendszer' : 'Login system',
      hu ? 'Keresés' : 'Search',
      hu ? 'Hírlap feliratkozás' : 'Newsletter signup',
      hu ? 'Térkép integráció' : 'Map integration',
    ];
  });

  copyOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Igen, minden megvan' : 'Yes, everything is ready',
      hu ? 'Részben megvan' : 'Partially ready',
      hu ? 'Nincs, kell segítség' : 'No, need help',
    ];
  });

  imageOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [
      hu ? 'Igen, minden megvan' : 'Yes, everything is ready',
      hu ? 'Részben megvan' : 'Partially ready',
      hu ? 'Nincs, kell stock fotó' : 'No, need stock photos',
    ];
  });

  yesNoOptions = computed(() => {
    const hu = this.i18n.lang() === 'hu';
    return [hu ? 'Igen' : 'Yes', hu ? 'Nem' : 'No', hu ? 'Nem tudom' : 'Not sure'];
  });

  openModal() {
    this.modalOpen = true;
    this.currentStep = 0;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modalOpen = false;
    document.body.style.overflow = '';
  }

  next() { if (this.currentStep <= this.TOTAL_STEPS) this.currentStep++; }
  back() { if (this.currentStep > 0) this.currentStep--; }

  async sendBriefEmail() {
    if (this.sendStatus === 'sending' || this.sendStatus === 'sent') return;
    this.sendStatus = 'sending';
    try {
      const res = await fetch('/.netlify/functions/send-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: this.summary, projectName: this.brief.projectName }),
      });
      this.sendStatus = res.ok ? 'sent' : 'error';
    } catch {
      this.sendStatus = 'error';
    }
  }

  toggle(arr: string[], val: string) {
    const i = arr.indexOf(val);
    if (i > -1) arr.splice(i, 1); else arr.push(val);
  }

  has(arr: string[], val: string) { return arr.includes(val); }

  get progress() { return Math.round((this.currentStep / this.TOTAL_STEPS) * 100); }

  scrollToContact() {
    this.closeModal();
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300);
  }

  get summary(): string {
    const b = this.brief;
    const hu = this.i18n.lang() === 'hu';
    const ln = (label: string, val: string | string[]) => {
      if (!val || (Array.isArray(val) && !val.length)) return '';
      return `**${label}:** ${Array.isArray(val) ? val.join(', ') : val}`;
    };
    return [
      `# Design Brief${b.projectName ? ' — ' + b.projectName : ''}`,
      `> ${hu ? 'Generálva' : 'Generated'}: liondesign.hu`,
      ``,
      `## 🎯 ${hu ? 'Projekt' : 'Project'}`,
      ln(hu ? 'Típus' : 'Type', b.siteType),
      ln(hu ? 'Iparág' : 'Industry', b.industry),
      ln(hu ? 'Fő cél' : 'Main goal', b.goal),
      b.currentSiteUrl ? ln(hu ? 'Jelenlegi oldal' : 'Current site', b.currentSiteUrl) : '',
      ``,
      `## 👥 ${hu ? 'Célközönség' : 'Target audience'}`,
      ln(hu ? 'Közönség' : 'Audience', b.audience),
      ln(hu ? 'Piaci szegmens' : 'Segment', b.b2b),
      b.keyMessage ? `**${hu ? 'Kulcsüzenet' : 'Key message'}:** "${b.keyMessage}"` : '',
      ``,
      `## 💻 ${hu ? 'Technológia' : 'Technology'}`,
      ln('Frontend', b.frontend || (hu ? 'Nincs meghatározva' : 'Not specified')),
      ``,
      `## 🔰 ${hu ? 'Márka' : 'Brand'}`,
      ln(hu ? 'Logó' : 'Logo', b.hasLogo),
      ln(hu ? 'Meglévő brand' : 'Existing brand', b.hasBrand),
      b.brandDetails ? ln(hu ? 'Brand részletek' : 'Brand details', b.brandDetails) : '',
      ``,
      `## 🎨 ${hu ? 'Színek' : 'Colors'}`,
      b.primaryColorKnown ? ln(hu ? 'Elsődleges szín' : 'Primary color', b.primaryColor) : `**${hu ? 'Elsődleges szín' : 'Primary color'}:** ${hu ? 'nyitott' : 'open'}`,
      b.secondaryColorKnown ? ln(hu ? 'Másodlagos szín' : 'Secondary color', b.secondaryColor) : `**${hu ? 'Másodlagos szín' : 'Secondary color'}:** ${hu ? 'nyitott' : 'open'}`,
      ln(hu ? 'Téma' : 'Theme', b.theme),
      ln(hu ? 'Hangulat/érzés' : 'Mood', b.mood),
      ``,
      `## ✍️ ${hu ? 'Tipográfia' : 'Typography'}`,
      ln(hu ? 'Betűstílus' : 'Font style', b.fontStyle),
      ln(hu ? 'Magyar ékezetek' : 'HU accents', b.needsHungarian),
      ``,
      `## 🖼️ ${hu ? 'Vizuális stílus' : 'Visual style'}`,
      ln(hu ? 'Stílusok' : 'Styles', b.visualStyles),
      b.inspirationUrls ? ln(hu ? 'Inspiráció' : 'Inspiration', b.inspirationUrls) : '',
      b.dislikedUrls ? ln(hu ? 'Nem tetszik' : 'Disliked', b.dislikedUrls) : '',
      ``,
      `## 📐 ${hu ? 'Elrendezés' : 'Layout'}`,
      ln(hu ? 'Struktúra' : 'Structure', b.pageStructure),
      ln(hu ? 'Szekciók' : 'Sections', b.sections),
      ln(hu ? 'Navigáció' : 'Navigation', b.navStyle),
      ln(hu ? 'Scroll animáció' : 'Scroll animation', b.scrollAnimations),
      ``,
      `## 📸 ${hu ? 'Képek & Média' : 'Images & Media'}`,
      ln(hu ? 'Fotóanyag' : 'Photos', b.hasPhotos),
      ln(hu ? 'Videó' : 'Video', b.needsVideo),
      ln(hu ? 'Ikonstílus' : 'Icon style', b.iconStyle),
      ``,
      `## ⚡ ${hu ? 'Animáció' : 'Animation'}`,
      b.animationLevel || '',
      ``,
      `## 🔧 ${hu ? 'Speciális funkciók' : 'Special features'}`,
      b.features.length ? b.features.join(', ') : (hu ? 'Nincs speciális funkció' : 'No special features'),
      ``,
      `## 📝 ${hu ? 'Tartalom & Határidő' : 'Content & Deadline'}`,
      ln(hu ? 'Szöveges tartalom' : 'Copy', b.hasCopy),
      ln(hu ? 'Képanyag' : 'Images', b.hasImages),
      b.deadline ? ln(hu ? 'Határidő' : 'Deadline', b.deadline) : '',
      b.mustHave ? ln(hu ? 'Mindenképpen legyen benne' : 'Must include', b.mustHave) : '',
      b.mustAvoid ? ln(hu ? 'Mindenképpen kerülni' : 'Must avoid', b.mustAvoid) : '',
    ].filter(l => l !== '').join('\n');
  }

}
