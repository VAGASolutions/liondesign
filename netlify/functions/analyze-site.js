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
  const keyParam = apiKey ? `&key=${apiKey}` : '';
  const base = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(normalized)}&strategy=mobile${keyParam}`;

  const categories = ['performance', 'seo', 'accessibility', 'best-practices'];
  const catParams = categories.map(c => `category=${c}`).join('&');

  try {
    const res = await fetch(`${base}&${catParams}`);
    if (!res.ok) {
      const err = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: `PageSpeed API error: ${res.status}`, detail: err }) };
    }

    const data = await res.json();
    const cats = data.lighthouseResult?.categories || {};
    const audits = data.lighthouseResult?.audits || {};

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
