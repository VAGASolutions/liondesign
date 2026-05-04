/* ============================================================
   SiteBoost — Analyzer Engine
   ============================================================ */

'use strict';

// ── NAV SCROLL EFFECT ─────────────────────────────────────────

window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── HAMBURGER ─────────────────────────────────────────────────

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ── SCROLL HELPERS ────────────────────────────────────────────

function scrollToAnalyzer() {
  document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── HERO URL → ANALYZER URL SYNC ─────────────────────────────

document.getElementById('heroUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') startAnalysis('hero');
});

document.getElementById('analyzerUrl').addEventListener('keydown', e => {
  if (e.key === 'Enter') startAnalysis('analyzer');
});

// ── TOAST ─────────────────────────────────────────────────────

function showToast(msg, duration = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

// ── TAB SWITCHING ─────────────────────────────────────────────

function showTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

// ── FAQ ───────────────────────────────────────────────────────

function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q.open').forEach(q => q.classList.remove('open'));
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

// ── ANALYSIS ORCHESTRATOR ─────────────────────────────────────

let isAnalyzing = false;

async function startAnalysis(source = 'analyzer') {
  if (isAnalyzing) return;

  const heroInput = document.getElementById('heroUrl');
  const analyzerInput = document.getElementById('analyzerUrl');

  let rawUrl = source === 'hero'
    ? heroInput.value.trim()
    : analyzerInput.value.trim();

  if (!rawUrl) {
    showToast('⚠️ Please enter a URL to analyze.');
    return;
  }

  // Normalize URL
  if (!/^https?:\/\//i.test(rawUrl)) rawUrl = 'https://' + rawUrl;

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    showToast('⚠️ That doesn\'t look like a valid URL. Try https://example.com');
    return;
  }

  // Sync both inputs
  heroInput.value = targetUrl.href;
  analyzerInput.value = targetUrl.href;

  scrollToAnalyzer();

  isAnalyzing = true;
  showLoading(true);
  resetResults();

  try {
    const html = await fetchPage(targetUrl.href);
    const checks = await runAllChecks(targetUrl, html);
    displayResults(targetUrl.href, checks);
  } catch (err) {
    showToast('❌ Could not fetch the page. The site may block external requests. Showing partial results.');
    const checks = await runAllChecks(targetUrl, null);
    displayResults(targetUrl.href, checks);
  } finally {
    isAnalyzing = false;
    showLoading(false);
  }
}

// ── PAGE FETCHER ──────────────────────────────────────────────

async function fetchPage(url) {
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];

  for (const proxy of proxies) {
    try {
      const resp = await Promise.race([
        fetch(proxy),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
      ]);

      if (!resp.ok) continue;

      const data = await resp.json().catch(async () => ({ contents: await resp.text() }));
      const html = data.contents || data;
      if (typeof html === 'string' && html.length > 100) return html;
    } catch {
      continue;
    }
  }
  throw new Error('All proxies failed');
}

// ── LOADING UI ────────────────────────────────────────────────

function showLoading(show) {
  document.getElementById('loadingState').style.display = show ? 'block' : 'none';
  document.getElementById('results').style.display = 'none';
  if (show) animateLoadingSteps();
}

function animateLoadingSteps() {
  const steps = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'];
  steps.forEach(id => {
    document.getElementById(id).className = 'loading-step';
  });
  document.getElementById('step1').classList.add('active');

  steps.forEach((id, i) => {
    setTimeout(() => {
      if (i > 0) {
        document.getElementById(steps[i - 1]).className = 'loading-step done';
        document.getElementById(steps[i - 1]).textContent = '✓ ' + document.getElementById(steps[i - 1]).textContent.replace(/^[^\s]+\s/, '');
      }
      document.getElementById(id).classList.add('active');
    }, i * 700);
  });
}

function resetResults() {
  ['seoChecks', 'securityChecks', 'performanceChecks', 'reachChecks'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
}

function resetAnalysis() {
  document.getElementById('results').style.display = 'none';
  document.getElementById('analyzerUrl').value = '';
  document.getElementById('heroUrl').value = '';
  document.getElementById('analyzerUrl').focus();
}

// ── ALL CHECKS ────────────────────────────────────────────────

async function runAllChecks(url, html) {
  const doc = html ? parseHTML(html) : null;
  const isHttps = url.protocol === 'https:';
  const hostname = url.hostname;

  const [seo, security, performance, reach] = await Promise.all([
    runSeoChecks(doc, url, isHttps),
    runSecurityChecks(doc, url, isHttps, html),
    runPerformanceChecks(doc, html),
    runReachChecks(doc, url, isHttps, hostname),
  ]);

  return { seo, security, performance, reach };
}

function parseHTML(html) {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

// ─────────────────────────────────────────────────────────────
// SEO CHECKS
// ─────────────────────────────────────────────────────────────

function runSeoChecks(doc, url, isHttps) {
  const checks = [];

  if (!doc) {
    checks.push(makeCheck('warn', 'Page content unavailable', 'Could not fetch the page to run SEO checks. Ensure the URL is publicly accessible.', null, null));
    return checks;
  }

  // Title
  const title = doc.querySelector('title')?.textContent?.trim() || '';
  if (!title) {
    checks.push(makeCheck('fail', 'Missing <title> tag', 'Every page must have a unique, descriptive title. This is one of the most important SEO signals.', null, 'Add a <title> tag inside <head> with 50–60 characters describing the page.'));
  } else if (title.length < 20) {
    checks.push(makeCheck('warn', 'Title tag too short', `Your title "${title}" is only ${title.length} chars. Aim for 50–60 characters.`, title, 'Expand the title to include your primary keyword and brand name.'));
  } else if (title.length > 65) {
    checks.push(makeCheck('warn', 'Title tag too long', `Your title is ${title.length} characters. Google truncates titles over ~60 chars in SERPs.`, title.slice(0, 65) + '…', 'Shorten to under 60 characters, keeping the primary keyword near the front.'));
  } else {
    checks.push(makeCheck('pass', 'Title tag looks good', `"${title}" (${title.length} chars) — well within the optimal 50–60 character range.`, title));
  }

  // Meta description
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  if (!metaDesc) {
    checks.push(makeCheck('fail', 'Missing meta description', 'The meta description is your ad copy in search results. Skipping it lets Google choose any text from your page.', null, 'Add <meta name="description" content="…"> with 120–160 characters summarising the page.'));
  } else if (metaDesc.length < 80) {
    checks.push(makeCheck('warn', 'Meta description too short', `Your description is only ${metaDesc.length} chars. You have space to add more context and keywords.`, metaDesc, 'Expand to 120–160 characters with your primary keyword and a call to action.'));
  } else if (metaDesc.length > 165) {
    checks.push(makeCheck('warn', 'Meta description too long', `At ${metaDesc.length} chars, Google will cut off your description in search results.`, metaDesc.slice(0, 160) + '…', 'Trim to 155–160 characters max.'));
  } else {
    checks.push(makeCheck('pass', 'Meta description is well-sized', `${metaDesc.length} characters — great length for search result snippets.`, metaDesc));
  }

  // H1
  const h1s = [...doc.querySelectorAll('h1')];
  if (h1s.length === 0) {
    checks.push(makeCheck('fail', 'No H1 heading found', 'Every page should have exactly one H1. It signals the main topic to search engines.', null, 'Add a single <h1> that includes your primary keyword.'));
  } else if (h1s.length > 1) {
    checks.push(makeCheck('warn', 'Multiple H1 headings found', `Found ${h1s.length} H1 tags. Having multiple H1s can dilute keyword focus.`, h1s.map(h => h.textContent.trim()).join(' | '), 'Keep exactly one H1 per page. Demote the others to H2 or H3.'));
  } else {
    checks.push(makeCheck('pass', 'Single H1 heading present', 'One H1 found — correct structure for SEO.', h1s[0].textContent.trim()));
  }

  // Heading hierarchy
  const h2s = doc.querySelectorAll('h2');
  const h3s = doc.querySelectorAll('h3');
  if (h2s.length === 0 && doc.body.textContent.length > 500) {
    checks.push(makeCheck('warn', 'No H2 headings found', 'H2 headings help structure content for readers and crawlers, improving both UX and SEO.', null, 'Break your content into sections with H2 headings targeting secondary keywords.'));
  } else {
    checks.push(makeCheck('pass', 'Heading hierarchy present', `H2: ${h2s.length}, H3: ${h3s.length} — good content structure.`));
  }

  // Images alt text
  const images = [...doc.querySelectorAll('img')];
  const missingAlt = images.filter(img => !img.getAttribute('alt') && !img.getAttribute('role'));
  if (images.length === 0) {
    checks.push(makeCheck('info', 'No images found', 'No images detected on this page.'));
  } else if (missingAlt.length > 0) {
    checks.push(makeCheck('warn', `${missingAlt.length} image(s) missing alt text`, `${missingAlt.length} of ${images.length} images lack alt attributes. This hurts image SEO and accessibility.`, `${missingAlt.length} / ${images.length} images affected`, 'Add descriptive alt text to every content image. Use alt="" for purely decorative images.'));
  } else {
    checks.push(makeCheck('pass', 'All images have alt text', `All ${images.length} images include alt attributes — great for SEO and accessibility.`));
  }

  // Canonical
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!canonical) {
    checks.push(makeCheck('warn', 'Missing canonical tag', 'Without a canonical URL, search engines may index duplicate versions of your page.', null, 'Add <link rel="canonical" href="https://yourdomain.com/page"> in <head>.'));
  } else {
    checks.push(makeCheck('pass', 'Canonical URL set', 'Canonical tag found — prevents duplicate content issues.', canonical));
  }

  // Open Graph
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');

  if (!ogTitle && !ogDesc) {
    checks.push(makeCheck('warn', 'Missing Open Graph tags', 'Without OG tags, shared links on Facebook, LinkedIn, and Slack won\'t show previews — reducing click-through rates.', null, 'Add og:title, og:description, og:image, and og:url meta tags in <head>.'));
  } else if (!ogImage) {
    checks.push(makeCheck('warn', 'Open Graph image missing', 'og:title and og:description found but no og:image. Social previews will be plain text only.', ogTitle || ogDesc, 'Add <meta property="og:image" content="https://…/image.jpg"> (1200×630px recommended).'));
  } else {
    checks.push(makeCheck('pass', 'Open Graph tags present', 'og:title, og:description, and og:image found — social sharing will show rich previews.', ogTitle));
  }

  // Robots meta
  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
  if (robotsMeta.includes('noindex')) {
    checks.push(makeCheck('fail', 'Page is set to noindex', 'This page tells search engines NOT to index it. If this is unintentional, it will never rank.', robotsMeta, 'Remove or change the noindex directive in the robots meta tag or X-Robots-Tag header.'));
  } else if (robotsMeta) {
    checks.push(makeCheck('pass', 'Robots meta tag found', 'Search engines are allowed to index this page.', robotsMeta));
  } else {
    checks.push(makeCheck('info', 'No robots meta tag', 'Without a robots meta tag, search engines default to index, follow — which is usually correct.'));
  }

  // Structured data
  const jsonLd = doc.querySelector('script[type="application/ld+json"]');
  if (!jsonLd) {
    checks.push(makeCheck('warn', 'No structured data (JSON-LD)', 'Structured data enables rich results (stars, FAQs, breadcrumbs) in Google, increasing click-through rates by 20–30%.', null, 'Add JSON-LD structured data matching your content type: Article, Product, LocalBusiness, FAQ, etc.'));
  } else {
    checks.push(makeCheck('pass', 'Structured data (JSON-LD) present', 'JSON-LD found — eligible for Google rich results.'));
  }

  // Twitter Card
  const twitterCard = doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
  if (!twitterCard) {
    checks.push(makeCheck('warn', 'Missing Twitter Card tags', 'Twitter won\'t show rich previews for your links without twitter:card meta tags.', null, 'Add <meta name="twitter:card" content="summary_large_image"> and twitter:title, twitter:description, twitter:image.'));
  } else {
    checks.push(makeCheck('pass', 'Twitter Card meta tags found', `twitter:card = ${twitterCard}`, twitterCard));
  }

  return checks;
}

// ─────────────────────────────────────────────────────────────
// SECURITY CHECKS
// ─────────────────────────────────────────────────────────────

function runSecurityChecks(doc, url, isHttps, rawHtml) {
  const checks = [];

  // HTTPS
  if (isHttps) {
    checks.push(makeCheck('pass', 'HTTPS enabled', 'The site uses HTTPS — data between users and the server is encrypted. Essential for trust and SEO.'));
  } else {
    checks.push(makeCheck('fail', 'HTTPS not used', 'The site is served over HTTP. Modern browsers warn users about insecure sites, and Google de-ranks HTTP pages.', 'http://', 'Install an SSL/TLS certificate (free via Let\'s Encrypt) and redirect all HTTP traffic to HTTPS.'));
  }

  // HSTS (can only really detect via response headers, but check meta for evidence)
  if (isHttps) {
    checks.push(makeCheck('info', 'HSTS header (server-side)', 'Strict-Transport-Security (HSTS) can only be validated by checking HTTP response headers server-side. Ensure max-age is at least 31536000 with includeSubDomains.', null, 'Set: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'));
  } else {
    checks.push(makeCheck('fail', 'HSTS cannot be set', 'HSTS requires HTTPS first. Enable HTTPS before configuring HSTS.', null, 'Enable HTTPS, then configure HSTS.'));
  }

  if (!doc) {
    checks.push(makeCheck('warn', 'Could not check HTML security', 'Page content unavailable for deep security analysis.'));
    return checks;
  }

  // Inline JS event handlers
  const inlineHandlers = [...doc.querySelectorAll('*')].filter(el => {
    return el.getAttributeNames?.()?.some(a => a.startsWith('on'));
  });

  if (inlineHandlers.length > 5) {
    checks.push(makeCheck('warn', `${inlineHandlers.length} inline event handlers detected`, 'Inline event handlers (onclick="…") make CSP enforcement impossible and are harder to audit for XSS vulnerabilities.', `${inlineHandlers.length} elements with inline handlers`, 'Move event handlers into external JavaScript files and enable a Content Security Policy.'));
  } else if (inlineHandlers.length > 0) {
    checks.push(makeCheck('info', `${inlineHandlers.length} inline event handler(s)`, 'A small number of inline event handlers present. Consider moving them to external scripts for better CSP compatibility.'));
  } else {
    checks.push(makeCheck('pass', 'No inline event handlers found', 'No inline onclick/onmouseover handlers detected — good for CSP compatibility.'));
  }

  // Inline scripts
  const inlineScripts = [...doc.querySelectorAll('script:not([src])')].filter(s => s.textContent.trim().length > 0);
  if (inlineScripts.length > 3) {
    checks.push(makeCheck('warn', `${inlineScripts.length} inline script blocks`, 'Inline scripts prevent strict CSP enforcement. If any are compromised, XSS can execute freely.', `${inlineScripts.length} inline <script> blocks`, 'Move scripts to external .js files and add a Content-Security-Policy header with script-src.'));
  } else if (inlineScripts.length > 0) {
    checks.push(makeCheck('info', `${inlineScripts.length} inline script block(s)`, 'A few inline scripts found. Consider externalizing them for better CSP compliance.'));
  } else {
    checks.push(makeCheck('pass', 'No inline script blocks', 'All JavaScript is loaded externally — enables strict CSP enforcement.'));
  }

  // External scripts
  const externalScripts = [...doc.querySelectorAll('script[src]')];
  const thirdPartyScripts = externalScripts.filter(s => {
    try { return new URL(s.src).hostname !== url.hostname; } catch { return false; }
  });

  if (thirdPartyScripts.length > 5) {
    checks.push(makeCheck('warn', `${thirdPartyScripts.length} third-party scripts loaded`, 'Each third-party script is a trust decision. A compromised CDN or analytics script can run arbitrary code on your site.', `${thirdPartyScripts.length} external domains`, 'Audit each third-party script. Add integrity="" (SRI) attributes for CDN-hosted scripts and remove any you don\'t need.'));
  } else if (thirdPartyScripts.length > 0) {
    checks.push(makeCheck('info', `${thirdPartyScripts.length} third-party script(s)`, `Loading scripts from ${thirdPartyScripts.length} external domain(s). Consider adding Subresource Integrity (SRI) hashes.`));
  } else {
    checks.push(makeCheck('pass', 'No third-party scripts', 'All scripts are served from the same origin — no external script supply-chain risk.'));
  }

  // Subresource Integrity
  const scriptsWithSri = externalScripts.filter(s => s.getAttribute('integrity'));
  if (externalScripts.length > 0 && scriptsWithSri.length === 0) {
    checks.push(makeCheck('warn', 'No Subresource Integrity (SRI) hashes', 'External scripts without SRI hashes can be silently modified by the CDN host without your knowledge.', null, 'Add integrity="sha384-…" and crossorigin="anonymous" attributes to CDN-hosted scripts.'));
  } else if (scriptsWithSri.length > 0) {
    checks.push(makeCheck('pass', `${scriptsWithSri.length} script(s) use SRI`, 'Subresource Integrity hashes found — external scripts are tamper-evident.'));
  }

  // Forms check
  const forms = [...doc.querySelectorAll('form')];
  const insecureForms = forms.filter(f => {
    const action = f.getAttribute('action') || '';
    return action.startsWith('http://');
  });

  if (insecureForms.length > 0) {
    checks.push(makeCheck('fail', `${insecureForms.length} form(s) submit to HTTP`, 'Forms that POST to HTTP URLs send data (passwords, personal info) in plain text — easily intercepted.', `${insecureForms.length} form(s) affected`, 'Change all form action URLs to HTTPS.'));
  } else if (forms.length > 0) {
    checks.push(makeCheck('pass', 'All forms use HTTPS actions', `${forms.length} form(s) found — all submit to HTTPS or same-origin.`));
  }

  // Meta referrer
  const referrerMeta = doc.querySelector('meta[name="referrer"]')?.getAttribute('content');
  if (!referrerMeta) {
    checks.push(makeCheck('info', 'No referrer-policy meta tag', 'Without a referrer policy, browsers may leak your full URL to third parties in the Referer header.', null, 'Add <meta name="referrer" content="strict-origin-when-cross-origin"> or set the Referrer-Policy HTTP header.'));
  } else {
    checks.push(makeCheck('pass', 'Referrer Policy meta tag found', 'Controls how much referrer information is sent with requests.', referrerMeta));
  }

  // Mixed content check (images over http)
  const httpImages = [...doc.querySelectorAll('img[src]')].filter(img => img.src?.startsWith('http://'));
  if (isHttps && httpImages.length > 0) {
    checks.push(makeCheck('fail', `${httpImages.length} image(s) loaded over HTTP (mixed content)`, 'Mixed content breaks HTTPS security and is blocked by modern browsers.', `${httpImages.length} insecure image(s)`, 'Update all image src attributes to use HTTPS URLs.'));
  } else if (isHttps) {
    checks.push(makeCheck('pass', 'No mixed content images detected', 'All image sources appear to use HTTPS — no mixed content warnings.'));
  }

  return checks;
}

// ─────────────────────────────────────────────────────────────
// PERFORMANCE CHECKS
// ─────────────────────────────────────────────────────────────

function runPerformanceChecks(doc, rawHtml) {
  const checks = [];

  if (!doc) {
    checks.push(makeCheck('warn', 'Could not analyze performance signals', 'Page content unavailable for performance checks.'));
    return checks;
  }

  // Viewport
  const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute('content');
  if (!viewport) {
    checks.push(makeCheck('fail', 'Missing viewport meta tag', 'Without a viewport tag, mobile users see a desktop-sized page, massively hurting UX and mobile rankings.', null, 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to <head>.'));
  } else if (!viewport.includes('width=device-width')) {
    checks.push(makeCheck('warn', 'Viewport tag may not be optimal', 'Viewport found but does not include width=device-width.', viewport, 'Use: <meta name="viewport" content="width=device-width, initial-scale=1">'));
  } else {
    checks.push(makeCheck('pass', 'Viewport meta tag configured correctly', 'width=device-width, initial-scale=1 — mobile-ready.', viewport));
  }

  // Charset
  const charset = doc.querySelector('meta[charset]') || doc.querySelector('meta[http-equiv="Content-Type"]');
  if (!charset) {
    checks.push(makeCheck('warn', 'Missing charset declaration', 'Without a charset, browsers must guess the encoding, risking garbled text.', null, 'Add <meta charset="UTF-8"> as the first element inside <head>.'));
  } else {
    checks.push(makeCheck('pass', 'Character encoding declared', 'Charset meta tag found — browsers know how to decode the page correctly.'));
  }

  // Render-blocking scripts
  const headScripts = [...doc.querySelectorAll('head script[src]')];
  const blockingScripts = headScripts.filter(s => !s.hasAttribute('defer') && !s.hasAttribute('async'));
  if (blockingScripts.length > 0) {
    checks.push(makeCheck('warn', `${blockingScripts.length} render-blocking script(s) in <head>`, 'Scripts in <head> without defer or async block HTML parsing, delaying First Contentful Paint.', `${blockingScripts.length} blocking script(s)`, 'Add defer attribute to non-critical scripts, or move them to the end of <body>.'));
  } else {
    checks.push(makeCheck('pass', 'No render-blocking scripts detected', 'Head scripts use defer/async or are absent — good for parse performance.'));
  }

  // Render-blocking CSS count
  const headLinks = [...doc.querySelectorAll('head link[rel="stylesheet"]')];
  if (headLinks.length > 4) {
    checks.push(makeCheck('warn', `${headLinks.length} stylesheet(s) in <head>`, 'Each stylesheet is render-blocking. Too many delay First Contentful Paint.', `${headLinks.length} CSS files`, 'Combine and minify stylesheets. Consider inlining critical CSS and lazy-loading the rest.'));
  } else {
    checks.push(makeCheck('pass', `${headLinks.length || 0} stylesheet(s) — acceptable count`, 'CSS file count looks reasonable.'));
  }

  // Preload hints
  const preloads = doc.querySelectorAll('link[rel="preload"]');
  const prefetches = doc.querySelectorAll('link[rel="prefetch"]');
  if (preloads.length === 0 && prefetches.length === 0) {
    checks.push(makeCheck('warn', 'No preload / prefetch hints', 'Resource hints tell the browser to fetch critical assets earlier, improving LCP (Largest Contentful Paint).', null, 'Add <link rel="preload"> for fonts, hero images, and critical CSS. Add <link rel="prefetch"> for next-page resources.'));
  } else {
    checks.push(makeCheck('pass', `${preloads.length} preload(s), ${prefetches.length} prefetch(es) found`, 'Resource hints present — browser can fetch critical assets early.'));
  }

  // Lazy loading
  const allImages = [...doc.querySelectorAll('img')];
  const lazyImages = allImages.filter(img => img.getAttribute('loading') === 'lazy');
  if (allImages.length > 3 && lazyImages.length === 0) {
    checks.push(makeCheck('warn', 'No lazy-loaded images', `${allImages.length} images found but none use loading="lazy". Off-screen images load unnecessarily, wasting bandwidth.`, null, 'Add loading="lazy" to all images below the fold.'));
  } else if (lazyImages.length > 0) {
    checks.push(makeCheck('pass', `${lazyImages.length} image(s) use lazy loading`, 'Native lazy loading found — off-screen images defer until needed.'));
  }

  // Image format hints
  const jpegPng = allImages.filter(img => /\.(jpg|jpeg|png)(\?|$)/i.test(img.getAttribute('src') || ''));
  const webp = allImages.filter(img => /\.webp(\?|$)/i.test(img.getAttribute('src') || ''));
  if (jpegPng.length > 2 && webp.length === 0) {
    checks.push(makeCheck('warn', `${jpegPng.length} JPEG/PNG image(s) — no WebP detected`, 'WebP format is 25–35% smaller than JPEG/PNG. Switching saves bandwidth and improves LCP.', `${jpegPng.length} non-WebP images`, 'Convert images to WebP and use <picture> for browser fallback.'));
  } else if (webp.length > 0) {
    checks.push(makeCheck('pass', `${webp.length} WebP image(s) detected`, 'WebP format found — modern browsers will load optimized images.'));
  }

  // HTML size hint
  if (rawHtml && rawHtml.length > 200000) {
    const sizeKB = Math.round(rawHtml.length / 1024);
    checks.push(makeCheck('warn', `Large HTML document (${sizeKB} KB)`, 'Very large HTML documents increase Time to First Byte and parsing time.', `${sizeKB} KB HTML`, 'Minimize server-rendered HTML. Move repeated markup to client-side templates or use pagination.'));
  } else if (rawHtml) {
    checks.push(makeCheck('pass', 'HTML document size looks reasonable', `${Math.round(rawHtml.length / 1024)} KB — within acceptable range.`));
  }

  // Favicon
  const favicon = doc.querySelector('link[rel*="icon"]');
  if (!favicon) {
    checks.push(makeCheck('info', 'No favicon link tag found', 'Without a favicon, browsers make an extra HTTP request to /favicon.ico. A favicon also aids brand recognition.', null, 'Add <link rel="icon" href="/favicon.svg" type="image/svg+xml"> in <head>.'));
  } else {
    checks.push(makeCheck('pass', 'Favicon link tag present', 'Browser will use the specified favicon path.', favicon.getAttribute('href')));
  }

  return checks;
}

// ─────────────────────────────────────────────────────────────
// REACH CHECKS
// ─────────────────────────────────────────────────────────────

async function runReachChecks(doc, url, isHttps, hostname) {
  const checks = [];
  const base = `${url.protocol}//${hostname}`;

  // Sitemap check
  try {
    const sitemapUrl = `${base}/sitemap.xml`;
    const resp = await Promise.race([
      fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(sitemapUrl)}`),
      new Promise((_, rej) => setTimeout(rej, 5000))
    ]);
    const data = await resp.json();
    const found = data?.contents?.includes('<urlset') || data?.contents?.includes('<sitemapindex');
    if (found) {
      checks.push(makeCheck('pass', 'sitemap.xml found', 'A valid XML sitemap was detected. Submit it to Google Search Console and Bing Webmaster Tools.', sitemapUrl));
    } else {
      checks.push(makeCheck('fail', 'sitemap.xml not found or invalid', 'Without a sitemap, search engines may miss pages, especially for large or newly launched sites.', sitemapUrl, 'Generate a sitemap.xml listing all important pages and add it to robots.txt: Sitemap: https://yourdomain.com/sitemap.xml'));
    }
  } catch {
    checks.push(makeCheck('warn', 'Could not verify sitemap.xml', 'Unable to check for sitemap — verify manually at /sitemap.xml.', `${base}/sitemap.xml`));
  }

  // Robots.txt check
  try {
    const robotsUrl = `${base}/robots.txt`;
    const resp = await Promise.race([
      fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(robotsUrl)}`),
      new Promise((_, rej) => setTimeout(rej, 5000))
    ]);
    const data = await resp.json();
    const content = data?.contents || '';
    if (content.includes('User-agent')) {
      const hasDisallow = content.includes('Disallow: /');
      if (content.includes('Disallow: /\n') || content.match(/Disallow:\s*\/\s*\n/)) {
        checks.push(makeCheck('fail', 'robots.txt blocks all crawlers', 'Your robots.txt contains "Disallow: /" which prevents search engines from crawling your entire site!', robotsUrl, 'Remove or narrow the blanket Disallow rule. Only block private sections (e.g., /admin/, /api/).'));
      } else {
        checks.push(makeCheck('pass', 'robots.txt found and configured', 'robots.txt present and allows crawling. Make sure it includes your Sitemap: directive.', robotsUrl));
      }
    } else {
      checks.push(makeCheck('warn', 'robots.txt not found', 'Without robots.txt, you can\'t control what crawlers index or exclude.', robotsUrl, 'Create /robots.txt with at minimum: User-agent: *\\nDisallow:\\nSitemap: https://yourdomain.com/sitemap.xml'));
    }
  } catch {
    checks.push(makeCheck('warn', 'Could not verify robots.txt', 'Unable to check — verify manually at /robots.txt.'));
  }

  if (!doc) return checks;

  // Language attribute
  const htmlLang = doc.documentElement?.getAttribute('lang');
  if (!htmlLang) {
    checks.push(makeCheck('warn', 'Missing lang attribute on <html>', 'Without a lang attribute, search engines and screen readers cannot determine the page\'s language.', null, 'Add lang="en" (or your language code) to the <html> element: <html lang="en">'));
  } else {
    checks.push(makeCheck('pass', 'Language attribute set', `lang="${htmlLang}" found on <html> — helps search engines serve the right language to users.`, htmlLang));
  }

  // Hreflang
  const hreflang = doc.querySelector('link[hreflang]');
  if (hreflang) {
    checks.push(makeCheck('pass', 'hreflang alternate links found', 'International audience targeting via hreflang detected.'));
  } else {
    checks.push(makeCheck('info', 'No hreflang links', 'If your site targets multiple countries or languages, add hreflang alternate links to boost geo-targeted reach.', null, 'Add <link rel="alternate" hreflang="fr" href="https://…/fr/"> for each locale.'));
  }

  // OG image (for social reach)
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
  if (!ogImage) {
    checks.push(makeCheck('warn', 'No og:image — social shares will be plain text', 'Pages without og:image don\'t show preview images on Facebook, LinkedIn, or iMessage, reducing click-through rates from social traffic.', null, 'Add <meta property="og:image" content="https://…/social-preview.jpg"> (1200×630px recommended).'));
  } else {
    checks.push(makeCheck('pass', 'og:image present', 'Social previews will include your specified image — boosts click-through from social media.', ogImage));
  }

  // Favicon (branding/reach)
  const favicon = doc.querySelector('link[rel*="icon"]');
  if (!favicon) {
    checks.push(makeCheck('info', 'No favicon — affects brand recognition', 'Favicon appears in browser tabs and bookmarks, supporting brand recall.', null, 'Add <link rel="icon" href="/favicon.svg" type="image/svg+xml"> in <head>.'));
  } else {
    checks.push(makeCheck('pass', 'Favicon configured', 'Favicon present — strengthens brand visibility in tabs and bookmarks.'));
  }

  // Internal link count
  const internalLinks = [...doc.querySelectorAll('a[href]')].filter(a => {
    const href = a.getAttribute('href') || '';
    return href.startsWith('/') || href.includes(hostname);
  });

  if (internalLinks.length < 3 && doc.body.textContent.length > 800) {
    checks.push(makeCheck('warn', 'Few internal links detected', `Only ${internalLinks.length} internal link(s) found. Internal linking spreads PageRank and helps crawlers discover all your pages.`, null, 'Add contextual links to related pages, a nav menu, breadcrumbs, and a footer sitemap.'));
  } else {
    checks.push(makeCheck('pass', `${internalLinks.length} internal link(s) found`, 'Internal linking structure detected — helps distribute PageRank across your site.'));
  }

  // External links (nofollow)
  const externalLinks = [...doc.querySelectorAll('a[href]')].filter(a => {
    const href = a.getAttribute('href') || '';
    return href.startsWith('http') && !href.includes(hostname);
  });

  const nofollow = externalLinks.filter(a => (a.getAttribute('rel') || '').includes('nofollow'));
  if (externalLinks.length > 0 && nofollow.length === 0) {
    checks.push(makeCheck('info', `${externalLinks.length} external link(s) without nofollow`, 'External links without rel="nofollow" pass PageRank to other sites. This is fine for trusted sites, but add nofollow for paid/untrusted links.'));
  } else if (externalLinks.length > 0) {
    checks.push(makeCheck('pass', `${nofollow.length} / ${externalLinks.length} external links use nofollow`, 'Sponsored or user-generated links are properly attributed.'));
  }

  return checks;
}

// ── CHECK ITEM FACTORY ────────────────────────────────────────

function makeCheck(status, title, desc, value = null, fix = null) {
  return { status, title, desc, value, fix };
}

// ── DISPLAY RESULTS ───────────────────────────────────────────

function displayResults(url, checks) {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('results').style.display = 'block';

  document.getElementById('analyzedUrl').textContent = url;

  // Render each category
  renderChecks('seoChecks', checks.seo);
  renderChecks('securityChecks', checks.security);
  renderChecks('performanceChecks', checks.performance);
  renderChecks('reachChecks', checks.reach);

  // Calculate scores
  const seoScore = calcScore(checks.seo);
  const secScore = calcScore(checks.security);
  const perfScore = calcScore(checks.performance);
  const reachScore = calcScore(checks.reach);
  const overall = Math.round((seoScore + secScore + perfScore + reachScore) / 4);

  // Animate circles
  setTimeout(() => {
    animateCircle('fillSeo', 'numSeo', 'gradeSeo', seoScore);
    animateCircle('fillSec', 'numSec', 'gradeSec', secScore);
    animateCircle('fillPerf', 'numPerf', 'gradePerf', perfScore);
    animateCircle('fillReach', 'numReach', 'gradeReach', reachScore);
    animateOverall(overall);
  }, 100);

  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderChecks(containerId, checks) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  if (!checks || checks.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No checks available for this category.</p>';
    return;
  }

  checks.forEach(check => {
    const item = document.createElement('div');
    item.className = `check-item ${check.status}`;

    const statusIcons = { pass: '✓', warn: '!', fail: '✗', info: 'i' };
    const statusText = { pass: 'Pass', warn: 'Warning', fail: 'Critical', info: 'Info' };

    item.innerHTML = `
      <div class="check-status" title="${statusText[check.status] || check.status}">
        ${statusIcons[check.status] || '?'}
      </div>
      <div class="check-body">
        <div class="check-title">${escHtml(check.title)}</div>
        <div class="check-desc">${escHtml(check.desc)}</div>
        ${check.value ? `<div class="check-value">${escHtml(String(check.value))}</div>` : ''}
        ${check.fix ? `<div class="check-fix">${escHtml(check.fix)}</div>` : ''}
      </div>
    `;
    container.appendChild(item);
  });
}

function calcScore(checks) {
  if (!checks || checks.length === 0) return 50;
  const weights = { pass: 0, fail: -3, warn: -1.5, info: 0 };
  const maxPossible = checks.filter(c => c.status !== 'info').length * 3;
  if (maxPossible === 0) return 80;

  let penalty = 0;
  checks.forEach(c => { penalty += Math.abs(weights[c.status] || 0); });
  const rawScore = Math.max(0, 100 - (penalty / maxPossible * 100));
  return Math.round(rawScore);
}

function getGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 55) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

function animateCircle(fillId, numId, gradeId, score) {
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  const fillEl = document.getElementById(fillId);
  const numEl = document.getElementById(numId);
  const gradeEl = document.getElementById(gradeId);

  fillEl.style.strokeDashoffset = offset;

  let current = 0;
  const step = score / 40;
  const timer = setInterval(() => {
    current = Math.min(current + step, score);
    numEl.textContent = Math.round(current);
    if (current >= score) clearInterval(timer);
  }, 25);

  const grade = getGrade(score);
  gradeEl.textContent = grade;
  gradeEl.className = `score-grade grade-${grade}`;
}

function animateOverall(score) {
  const fillEl = document.getElementById('overallFill');
  const numEl = document.getElementById('overallScore');

  const color = score >= 75 ? 'var(--green)' : score >= 55 ? 'var(--amber)' : 'var(--red)';
  numEl.style.color = color;

  setTimeout(() => {
    fillEl.style.width = score + '%';
  }, 200);

  let current = 0;
  const step = score / 40;
  const timer = setInterval(() => {
    current = Math.min(current + step, score);
    numEl.textContent = Math.round(current) + '/100';
    if (current >= score) clearInterval(timer);
  }, 25);
}

// ── UTILITIES ─────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
