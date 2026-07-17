export async function onRequestGet({ env, request }) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);

  if (!match) {
    return new Response(JSON.stringify({ user: null }), {
      headers: { 'content-type': 'application/json' }
    });
  }

  const raw = await env.GUESTBOOK_KV.get(`session_${match[1]}`);
  if (!raw) {
    return new Response(JSON.stringify({ user: null }), {
      headers: { 'content-type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ user: JSON.parse(raw) }), {
    headers: { 'content-type': 'application/json' }
  });
}
