export async function onRequestGet({ env, request }) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rlKey = `rl_visit_${ip}`;
    const raw = await env.GUESTBOOK_KV.get('visit_count');
    let count = raw ? parseInt(raw, 10) : 0;

    const rl = await env.GUESTBOOK_KV.get(rlKey);
    if (!rl) {
      count += 1;
      await env.GUESTBOOK_KV.put('visit_count', String(count));
      await env.GUESTBOOK_KV.put(rlKey, '1', { expirationTtl: 60 });
    }

    return new Response(JSON.stringify({ count }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'kv_not_configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
