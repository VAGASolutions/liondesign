import { Component, inject } from '@angular/core';
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
  readonly TOTAL_STEPS = 13;
  copied = false;

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
    const ln = (label: string, val: string | string[]) => {
      if (!val || (Array.isArray(val) && !val.length)) return '';
      return `**${label}:** ${Array.isArray(val) ? val.join(', ') : val}`;
    };
    return [
      `# Design Brief${b.projectName ? ' — ' + b.projectName : ''}`,
      `> Generálva: liondesign.hu`,
      ``,
      `## 🎯 Projekt`,
      ln('Típus', b.siteType),
      ln('Iparág', b.industry),
      ln('Fő cél', b.goal),
      b.currentSiteUrl ? ln('Jelenlegi oldal', b.currentSiteUrl) : '',
      ``,
      `## 👥 Célközönség`,
      ln('Közönség', b.audience),
      ln('Piaci szegmens', b.b2b),
      b.keyMessage ? `**Kulcsüzenet:** "${b.keyMessage}"` : '',
      ``,
      `## 💻 Technológia`,
      ln('Frontend', b.frontend || 'Nincs meghatározva'),
      ``,
      `## 🔰 Márka`,
      ln('Logó', b.hasLogo),
      ln('Meglévő brand', b.hasBrand),
      b.brandDetails ? ln('Brand részletek', b.brandDetails) : '',
      ``,
      `## 🎨 Színek`,
      b.primaryColorKnown ? ln('Elsődleges szín', b.primaryColor) : '**Elsődleges szín:** nyitott',
      b.secondaryColorKnown ? ln('Másodlagos szín', b.secondaryColor) : '**Másodlagos szín:** nyitott',
      ln('Téma', b.theme),
      ln('Hangulat/érzés', b.mood),
      ``,
      `## ✍️ Tipográfia`,
      ln('Betűstílus', b.fontStyle),
      ln('Magyar ékezetek', b.needsHungarian),
      ``,
      `## 🖼️ Vizuális stílus`,
      ln('Stílusok', b.visualStyles),
      b.inspirationUrls ? ln('Inspiráció', b.inspirationUrls) : '',
      b.dislikedUrls ? ln('Nem tetszik', b.dislikedUrls) : '',
      ``,
      `## 📐 Elrendezés`,
      ln('Struktúra', b.pageStructure),
      ln('Szekciók', b.sections),
      ln('Navigáció', b.navStyle),
      ln('Scroll animáció', b.scrollAnimations),
      ``,
      `## 📸 Képek & Média`,
      ln('Fotóanyag', b.hasPhotos),
      ln('Videó', b.needsVideo),
      ln('Ikonstílus', b.iconStyle),
      ``,
      `## ⚡ Animáció`,
      b.animationLevel || '',
      ``,
      `## 🔧 Speciális funkciók`,
      b.features.length ? b.features.join(', ') : 'Nincs speciális funkció',
      ``,
      `## 📝 Tartalom & Határidő`,
      ln('Szöveges tartalom', b.hasCopy),
      ln('Képanyag', b.hasImages),
      b.deadline ? ln('Határidő', b.deadline) : '',
      b.mustHave ? ln('Mindenképpen legyen benne', b.mustHave) : '',
      b.mustAvoid ? ln('Mindenképpen kerülni', b.mustAvoid) : '',
    ].filter(l => l !== '').join('\n');
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.summary).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2500);
    });
  }
}
