const OWNER_DISCORD_ID = '803662340465229855';

async function getSessionUser(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return null;
  const raw = await env.GUESTBOOK_KV.get(`session_${match[1]}`);
  return raw ? JSON.parse(raw) : null;
}

export async function onRequestGet({ env }) {
  try {
    const raw = await env.GUESTBOOK_KV.get('servers');
    const servers = raw ? JSON.parse(raw) : [];
    return new Response(JSON.stringify(servers), {
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
    const user = await getSessionUser(request, env);
    if (!user || user.id !== OWNER_DISCORD_ID) {
      return new Response(JSON.stringify({ error: 'forbidden' }), {
        status: 403,
        headers: { 'content-type': 'application/json' }
      });
    }

    const body = await request.json();
    const inviteCode = (body.invite || '').toString().trim().replace(/^https?:\/\/(www\.)?discord(\.gg|\.com\/invite)\//, '').replace(/\//g, '');
    if (!inviteCode) {
      return new Response(JSON.stringify({ error: 'missing_invite' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const inviteRes = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`);
    const inviteData = await inviteRes.json();
    if (!inviteData.guild) {
      return new Response(JSON.stringify({ error: 'invalid_invite' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const raw = await env.GUESTBOOK_KV.get('servers');
    const servers = raw ? JSON.parse(raw) : [];

    if (servers.some(s => s.id === inviteData.guild.id)) {
      return new Response(JSON.stringify({ error: 'already_added' }), {
        status: 409,
        headers: { 'content-type': 'application/json' }
      });
    }

    servers.push({
      id: inviteData.guild.id,
      name: inviteData.guild.name,
      icon: inviteData.guild.icon,
      invite: inviteCode,
      desc: (body.desc || '').toString().trim().slice(0, 120)
    });

    await env.GUESTBOOK_KV.put('servers', JSON.stringify(servers));

    return new Response(JSON.stringify(servers), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'kv_not_configured' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
