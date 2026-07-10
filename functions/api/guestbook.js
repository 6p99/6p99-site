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
    const userIP = request.headers.get("CF-Connecting-IP") || "anonymous";
    const rateLimitKey = `limit:${userIP}`;

    const hasCommented = await env.GUESTBOOK_KV.get(rateLimitKey);
    if (hasCommented) {
      return new Response(JSON.stringify({ error: 'rate_limited', message: 'يمكنك كتابة تعليق واحد فقط كل 24 ساعة.' }), {
        status: 429,
        headers: { 'content-type': 'application/json' }
      });
    }

    const body = await request.json();
    const name = (body.name || '').toString().trim().slice(0, 40);
    const msg = (body.msg || '').toString().trim().slice(0, 300);

    if (!name || !msg) {
      return new Response(JSON.stringify({ error: 'missing_fields' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const raw = await env.GUESTBOOK_KV.get('entries');
    const entries = raw ? JSON.parse(raw) : [];
    entries.push({ name, msg, time: Date.now() });
    while (entries.length > 200) entries.shift();

    await env.GUESTBOOK_KV.put('entries', JSON.stringify(entries));
    await env.GUESTBOOK_KV.put(rateLimitKey, 'true', { expirationTtl: 86400 });

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
