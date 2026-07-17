export async function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return Response.redirect(url.origin, 302);
  }

  const redirectUri = `${url.origin}/api/auth/callback`;

  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return Response.redirect(url.origin, 302);
  }

  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const user = await userRes.json();

  const sessionId = crypto.randomUUID();
  await env.GUESTBOOK_KV.put(`session_${sessionId}`, JSON.stringify({
    id: user.id,
    username: user.username,
    avatar: user.avatar
  }), { expirationTtl: 604800 });

  const headers = new Headers();
  headers.set('Location', url.origin);
  headers.append('Set-Cookie', `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);

  return new Response(null, { status: 302, headers });
}
