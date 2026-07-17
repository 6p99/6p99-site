export async function onRequestGet({ env }) {
  try {
    const raw = await env.GUESTBOOK_KV.get('entries');
    const entries = raw ? JSON.parse(raw) : [];
    return new Response(JSON.stringify(entries), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'kv_not_configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const body = await request.json();

    const honeypot = (body.hp || '').toString();
    if (honeypot) {
      return new Response(JSON.stringify({ error: 'rejected' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const name = (body.name || '').toString().trim().slice(0, 40);
    const msg = (body.msg || '').toString().trim().slice(0, 300);

    if (!name || !msg) {
      return new Response(JSON.stringify({ error: 'missing_fields' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const rlKey = `rl_gb_${ip}`;
    const rl = await env.GUESTBOOK_KV.get(rlKey);
    if (rl) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), {
        status: 429,
        headers: { 'content-type': 'application/json' }
      });
    }

    const raw = await env.GUESTBOOK_KV.get('entries');
    const entries = raw ? JSON.parse(raw) : [];
    entries.push({ name, msg, time: Date.now() });
    while (entries.length > 200) entries.shift();

    await env.GUESTBOOK_KV.put('entries', JSON.stringify(entries));
    await env.GUESTBOOK_KV.put(rlKey, '1', { expirationTtl: 30 });

    return new Response(JSON.stringify(entries), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'kv_not_configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
