exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing RESEND_API_KEY env var' }) };
  }

  let summary, projectName;
  try {
    ({ summary, projectName } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:700px;margin:0 auto;background:#111;color:#f5f5f5;padding:2rem;border-radius:12px">
      <h2 style="color:#f59e0b;margin-top:0">🦁 Új Design Brief érkezett</h2>
      <p style="color:#999;font-size:0.9rem">Projekt: <strong style="color:#fff">${projectName || '—'}</strong></p>
      <hr style="border-color:#333;margin:1.5rem 0"/>
      <pre style="white-space:pre-wrap;font-family:monospace;font-size:0.85rem;line-height:1.6;color:#e5e5e5">${summary}</pre>
      <hr style="border-color:#333;margin:1.5rem 0"/>
      <p style="color:#666;font-size:0.8rem">liondesign.hu — design brief beküldés</p>
    </div>
  `;

  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: 'webkorte@gmail.com',
      subject: `Új design brief${projectName ? ': ' + projectName : ''}`,
      html,
      text: summary,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { statusCode: 502, body: JSON.stringify({ error: err }) };
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
