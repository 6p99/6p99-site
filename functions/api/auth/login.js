export function onRequestGet({ env, request }) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify'
  });
  return Response.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`, 302);
}
