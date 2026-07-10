export async function onRequestGet({ env, request }) {
  try {
    const userIP = request.headers.get("CF-Connecting-IP") || "anonymous";
    const visitKey = `visit:${userIP}`;

    const rawCount = await env.GUESTBOOK_KV.get('visit_count');
    let count = rawCount ? parseInt(rawCount, 10) : 0;

    const hasVisited = await env.GUESTBOOK_KV.get(visitKey);

    if (!hasVisited) {
      count += 1;
      await env.GUESTBOOK_KV.put('visit_count', String(count));
      await env.GUESTBOOK_KV.put(visitKey, 'true'); 
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
