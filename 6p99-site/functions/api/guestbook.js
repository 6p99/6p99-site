// Cloudflare Pages Function — /api/guestbook
// Requires a KV namespace bound as "GUESTBOOK_KV" in project Settings → Functions.

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
    while (entries.length > 200) entries.shift(); // keep it bounded

    await env.GUESTBOOK_KV.put('entries', JSON.stringify(entries));

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
