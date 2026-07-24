import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n.service';

interface AuditResult {
  url: string;
  scores: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
  };
  topIssues: { title: string; description: string }[];
}

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './analyzer.component.html',
  styleUrl: './analyzer.component.scss',
})
export class AnalyzerComponent {
  i18n = inject(I18nService);

  url = '';
  status = signal<'idle' | 'loading' | 'done' | 'error'>('idle');
  result = signal<AuditResult | null>(null);
  errorMsg = signal('');

  readonly METRICS = [
    { key: 'performance' as const, labelEn: 'Performance', labelHu: 'Teljesítmény', icon: '⚡' },
    { key: 'seo' as const, labelEn: 'SEO', labelHu: 'SEO', icon: '🔍' },
    { key: 'accessibility' as const, labelEn: 'Accessibility', labelHu: 'Akadálymentesség', icon: '♿' },
    { key: 'bestPractices' as const, labelEn: 'Best Practices', labelHu: 'Legjobb gyakorlatok', icon: '✅' },
  ];

  metricLabel(m: typeof this.METRICS[0]) {
    return this.i18n.lang() === 'hu' ? m.labelHu : m.labelEn;
  }

  scoreColor(score: number): string {
    if (score >= 90) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  }

  scoreLabel(score: number): string {
    const hu = this.i18n.lang() === 'hu';
    if (score >= 90) return hu ? 'Kiváló' : 'Good';
    if (score >= 50) return hu ? 'Fejleszthető' : 'Needs work';
    return hu ? 'Gyenge' : 'Poor';
  }

  radarPath = computed(() => {
    const r = this.result();
    if (!r) return '';
    const scores = [
      r.scores.performance,
      r.scores.seo,
      r.scores.accessibility,
      r.scores.bestPractices,
    ];
    return this.buildRadarPath(scores, 120, 4);
  });

  private buildRadarPath(scores: number[], radius: number, count: number): string {
    const cx = 140, cy = 140;
    const points = scores.map((s, i) => {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const r = (s / 100) * radius;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';
  }

  radarGridPaths(levels = 4): string[] {
    return Array.from({ length: levels }, (_, li) => {
      const r = ((li + 1) / levels) * 120;
      return this.buildRadarPath([r / 1.2, r / 1.2, r / 1.2, r / 1.2].map(v => v * 1.2 / 120 * 100), 120, 4);
    });
  }

  radarAxes(): { x1: number; y1: number; x2: number; y2: number; lx: number; ly: number; label: string }[] {
    const cx = 140, cy = 140, r = 120;
    return this.METRICS.map((m, i) => {
      const angle = (i / this.METRICS.length) * 2 * Math.PI - Math.PI / 2;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const lr = r + 22;
      return {
        x1: cx, y1: cy, x2, y2,
        lx: cx + lr * Math.cos(angle),
        ly: cy + lr * Math.sin(angle),
        label: this.metricLabel(m),
      };
    });
  }

  async analyze() {
    const raw = this.url.trim();
    if (!raw) return;
    this.status.set('loading');
    this.result.set(null);
    try {
      const res = await fetch(`/.netlify/functions/analyze-site?url=${encodeURIComponent(raw)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      this.result.set(data);
      this.status.set('done');
    } catch (e: unknown) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Unknown error');
      this.status.set('error');
    }
  }

  reset() {
    this.status.set('idle');
    this.result.set(null);
    this.url = '';
  }
}
