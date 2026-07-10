export async function onRequestGet({ env }) {
  try {
    const raw = await env.GUESTBOOK_KV.get('visit_count');
    let count = raw ? parseInt(raw, 10) : 0;
    count += 1;
    await env.GUESTBOOK_KV.put('visit_count', String(count));

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
