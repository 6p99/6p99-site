export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);

  if (match) {
    await env.GUESTBOOK_KV.delete(`session_${match[1]}`);
  }

  const headers = new Headers();
  headers.set('Location', url.origin);
  headers.append('Set-Cookie', `session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);

  return new Response(null, { status: 302, headers });
}
