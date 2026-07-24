const CATEGORIES = ['performance', 'seo', 'accessibility', 'best-practices'];

async function fetchPageSpeed(url, apiKey) {
  const keyParam = apiKey ? `&key=${apiKey}` : '';
  const catParams = CATEGORIES.map(c => `category=${c}`).join('&');
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile${keyParam}&${catParams}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 1500));
    const res = await fetch(apiUrl);
    if (res.status === 429) {
      if (attempt === 0) continue;
      return { error: 'rate_limit' };
    }
    if (!res.ok) {
      const detail = await res.text();
      return { error: `PageSpeed API error: ${res.status}`, detail };
    }
    return { data: await res.json() };
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const url = event.queryStringParameters?.url;
  if (!url) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing url parameter' }) };
  }

  let normalized;
  try {
    normalized = new URL(url.startsWith('http') ? url : `https://${url}`).href;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid URL' }) };
  }

  const apiKey = process.env.PAGESPEED_API_KEY || '';

  try {
    const result = await fetchPageSpeed(normalized, apiKey);

    if (result.error === 'rate_limit') {
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'The PageSpeed API is temporarily rate-limited. Please try again in a few seconds.' }),
      };
    }

    if (result.error) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: result.error, detail: result.detail }),
      };
    }

    const cats = result.data.lighthouseResult?.categories || {};
    const audits = result.data.lighthouseResult?.audits || {};
    const score = (key) => Math.round((cats[key]?.score ?? 0) * 100);

    const topIssues = Object.values(audits)
      .filter(a => a.score !== null && a.score < 0.9 && a.details?.type !== 'opportunity' && a.title)
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
      .slice(0, 4)
      .map(a => ({ title: a.title, description: a.description?.split('.')[0] || '' }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        url: normalized,
        scores: {
          performance: score('performance'),
          seo: score('seo'),
          accessibility: score('accessibility'),
          bestPractices: score('best-practices'),
        },
        topIssues,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
