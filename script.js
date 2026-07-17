let lastToml = null;
const translations = {
  "nav.home": {en:"home", ar:"الرئيسية"},
  "nav.about": {en:"about", ar:"الهوية"},
  "nav.projects": {en:"projects", ar:"المشاريع"},
  "nav.servers": {en:"servers", ar:"السيرفرات"},
  "nav.blog": {en:"blog", ar:"المدونة"},
  "nav.guestbook": {en:"guestbook", ar:"سجل الزوار"},

  "hero.answer": {en:"Discord bot developer.", ar:"مطوّر بوتات ديسكورد."},
  "hero.sub": {en:"Node.js · discord.js v14 · Python — mostly built on Termux.", ar:"Node.js · discord.js v14 · Python — أغلب الشغل مبني على Termux."},
  "hero.scroll": {en:"scroll", ar:"انزل"},

  "home.nav.about.title": {en:"about", ar:"الهوية"},
  "home.nav.about.desc": {en:"identity.toml, live from GitHub", ar:"identity.toml، حي من GitHub"},
  "home.nav.projects.title": {en:"projects", ar:"المشاريع"},
  "home.nav.projects.desc": {en:"repos, pulled live from GitHub", ar:"مستودعات، تُسحب حية من GitHub"},
  "home.nav.blog.title": {en:"blog", ar:"المدونة"},
  "home.nav.blog.desc": {en:"notes and devlogs", ar:"ملاحظات ومقالات تقنية"},
  "home.nav.guestbook.title": {en:"guestbook", ar:"سجل الزوار"},
  "home.nav.guestbook.desc": {en:"leave a message", ar:"اترك رسالة"},

  "section.status.title": {en:"live status", ar:"الحالة الحية"},
  "status.connecting": {en:"connecting to live status…", ar:"جاري الاتصال بالحالة الحية…"},

  "profile.about.label": {en:"about me", ar:"نبذة عني"},
  "profile.connections.label": {en:"connections", ar:"الحسابات"},
  "pa.message": {en:"Message", ar:"مراسلة"},
  "pa.github": {en:"GitHub", ar:"GitHub"},

  "about.title": {en:"about", ar:"الهوية"},
  "blog.lede": {en:"Devlogs and notes", ar:"مقالات وملاحظات"},
  "section.identity.title": {en:"identity.toml", ar:"identity.toml"},
  "section.identity.loading": {en:"pulling from GitHub…", ar:"جاري السحب من GitHub…"},
  "section.stack.title": {en:"stack", ar:"الأدوات"},

  "projects.title": {en:"projects", ar:"المشاريع"},
  "servers.title": {en:"servers", ar:"السيرفرات"},
  "servers.empty": {en:"no servers added yet.", ar:"ولا سيرفر مضاف لسا."},
  "servers.alreadyAdded": {en:"this server is already on the list.", ar:"هاد السيرفر مضاف أصلاً."},
  "servers.addError": {en:"couldn't add that server — check the invite link.", ar:"ما قدرت أضيف السيرفر — تأكد من رابط الدعوة."},
  "srv.invite.placeholder": {en:"invite link or code", ar:"رابط أو كود الدعوة"},
  "srv.desc.placeholder": {en:"short description (optional)", ar:"وصف قصير (اختياري)"},
  "srv.submit": {en:"add server", ar:"ضيف سيرفر"},
  "auth.login": {en:"login", ar:"دخول"},
  "auth.logout": {en:"logout", ar:"خروج"},
  "repos.loading": {en:"loading repositories from GitHub…", ar:"جاري تحميل المستودعات من GitHub…"},

  "blog.title": {en:"blog", ar:"المدونة"},
  "blog.empty.title": {en:"nothing published yet", ar:"ولا مقالة منشورة لسا"},
  "blog.empty.desc": {en:"check back later, or follow the GitHub activity in the meantime.", ar:"ارجع لاحقاً، أو تابع نشاطي على GitHub لحد هيك."},

  "guestbook.title": {en:"guestbook", ar:"سجل الزوار"},
  "gb.name.placeholder": {en:"your name", ar:"اسمك"},
  "gb.msg.placeholder": {en:"your message…", ar:"رسالتك…"},
  "gb.submit": {en:"sign the guestbook", ar:"وقّع بسجل الزوار"},
  "gb.empty": {en:"no messages yet — be the first.", ar:"ولا رسالة لسا — كون أول وحد."},
  "gb.notConfigured": {en:"guestbook backend isn't connected yet.", ar:"سجل الزوار مش موصول بقاعدة بيانات لسا."},
  "gb.rateLimited": {en:"slow down — wait a bit before signing again.", ar:"شوي شوي — استنى شوي قبل ما توقّع مرة تانية."},
  "server.online": {en:"online", ar:"متصل"},
  "server.members": {en:"members", ar:"عضو"},
  "server.error": {en:"couldn't load server stats", ar:"تعذّر تحميل إحصائيات السيرفر"},
  "server.join": {en:"Join", ar:"انضم"},
  "visits.label": {en:"visits", ar:"زيارة"},

  "contact.title": {en:"contact", ar:"تواصل"}
};

const extra = {
  identityError: {en:"couldn't reach GitHub right now.\nsource: github.com/6p99/6p99", ar:"تعذّر الوصول لـ GitHub الآن.\nالمصدر: github.com/6p99/6p99"},
  statusFallback: {
    en:'need to join the <a href="https://discord.gg/lanyard" target="_blank" rel="noopener">Lanyard</a> server for live status to work.',
    ar:'لازم تنضم لسيرفر <a href="https://discord.gg/lanyard" target="_blank" rel="noopener">Lanyard</a> حتى تشتغل الحالة الحية.'
  },
  stateLabel: {
    online:{en:"online", ar:"متصل الآن"},
    idle:{en:"idle", ar:"بعيد شوي"},
    dnd:{en:"do not disturb", ar:"مشغول"},
    offline:{en:"offline", ar:"غير متصل"}
  },
  repoEmpty: {
    en:'no public repos yet — <a href="https://github.com/6p99" target="_blank" rel="noopener">see full profile</a>.',
    ar:'ولا مستودع عام لسا — <a href="https://github.com/6p99" target="_blank" rel="noopener">شوف البروفايل كامل</a>.'
  },
  repoError: {
    en:'failed to load (rate limited?) — <a href="https://github.com/6p99" target="_blank" rel="noopener">github.com/6p99</a>',
    ar:'تعذّر التحميل (rate limit؟) — <a href="https://github.com/6p99" target="_blank" rel="noopener">github.com/6p99</a>'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme(theme){
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById('themeToggle');
  if(btn) btn.textContent = theme === 'light' ? 'dark' : 'light';
}

function applyLang(lang){
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dataset.lang = lang;
  const toggle = document.getElementById('langToggle');
  if(toggle) toggle.textContent = lang === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(translations[key]) el.textContent = translations[key][lang];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    if(translations[key]) el.placeholder = translations[key][lang];
  });
  refreshDynamicText();
}

document.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.getElementById('langToggle');
  if(toggle) toggle.addEventListener('click', ()=> applyLang(currentLang === 'en' ? 'ar' : 'en'));

  const themeBtn = document.getElementById('themeToggle');
  if(themeBtn) themeBtn.addEventListener('click', ()=> applyTheme(currentTheme === 'light' ? 'dark' : 'light'));
  applyTheme(currentTheme);

  const page = document.body.dataset.page;
  document.querySelectorAll('.sb-tab').forEach(tab=>{
    if(tab.dataset.page === page) tab.classList.add('active');
  });

  applyLang(currentLang);
});

(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const el = document.querySelector('.sb-tabs');
    if(!el) return;
    let isDown = false, startX = 0, startScroll = 0, moved = 0;

    const down = (x)=>{ isDown = true; moved = 0; startX = x; startScroll = el.scrollLeft; el.classList.add('dragging'); };
    const move = (x)=>{
      if(!isDown) return;
      const delta = x - startX;
      moved = Math.max(moved, Math.abs(delta));
      el.scrollLeft = startScroll - delta;
    };
    const up = ()=>{ isDown = false; el.classList.remove('dragging'); };

    el.addEventListener('mousedown', (e)=> down(e.pageX));
    window.addEventListener('mousemove', (e)=> move(e.pageX));
    window.addEventListener('mouseup', up);

    el.addEventListener('touchstart', (e)=> down(e.touches[0].pageX), { passive:true });
    el.addEventListener('touchmove', (e)=> move(e.touches[0].pageX), { passive:true });
    el.addEventListener('touchend', up);

    el.addEventListener('click', (e)=>{
      if(moved > 6){ e.preventDefault(); e.stopPropagation(); }
    }, true);
  });
})();

(function(){
  function tick(){
    const el = document.getElementById('clock');
    if(!el) return;
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone:'Asia/Amman', hour:'2-digit', minute:'2-digit', hour12:false });
    el.textContent = fmt.format(new Date()) + ' AMM';
  }
  tick(); setInterval(tick, 1000);
})();

(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.12 });
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
  });
})();

let identityStatus = 'loading';
(function(){
  const README_URL = 'https://raw.githubusercontent.com/6p99/6p99/main/README.md';
  function extractToml(md){
    const m = md.match(/```toml\n([\s\S]*?)```/);
    return m ? m[1].trim() : null;
  }
  function injectBorn(toml){
    return toml.replace(/(alias\s*=\s*"[^"]*")/, `$1\nborn      = "2007"`);
  }
  window.loadIdentity = async function(){
    if(!document.getElementById('identityBox')) return;
    try{
      const res = await fetch(`${README_URL}?_=${Date.now()}`);
      const md = await res.text();
      const toml = extractToml(md);
      if(!toml) throw new Error('no toml');
      lastToml = injectBorn(toml);
      identityStatus = 'ok';
    }catch(e){ identityStatus = 'error'; }
    renderIdentity();
  };
  document.addEventListener('DOMContentLoaded', ()=>{
    if(document.getElementById('identityBox')){
      loadIdentity();
      setInterval(loadIdentity, 5*60*1000);
    }
  });
})();

let identityTyped = false;
function typeText(el, text){
  el.textContent = '';
  let i = 0;
  const step = ()=>{
    i += 3;
    el.textContent = text.slice(0, i);
    if(i < text.length) requestAnimationFrame(step);
  };
  step();
}
function renderIdentity(){
  const box = document.getElementById('identityBox');
  if(!box) return;
  if(identityStatus === 'ok'){
    if(!identityTyped){
      identityTyped = true;
      typeText(box, lastToml);
    }else{
      box.textContent = lastToml;
    }
  }
  else if(identityStatus === 'error') box.textContent = extra.identityError[currentLang];
  else box.textContent = translations["section.identity.loading"][currentLang];
}

let lanyardStatus = 'loading';
let lastLanyardData = null;
(function(){
  const DISCORD_ID = '803662340465229855';

  window.renderLanyard = function(){
    const avatar = document.getElementById('pfAvatar');
    const dot = document.getElementById('pfStatusDot');
    const name = document.getElementById('pfName');
    const handle = document.getElementById('pfHandle');
    const activity = document.getElementById('pfActivity');
    if(!avatar) return; // profile card not on this page

    if(lanyardStatus !== 'ok' || !lastLanyardData){
      dot.className = 'profile-status-dot offline';
      if(activity) activity.textContent = '';
      return;
    }
    const data = lastLanyardData;
    const u = data.discord_user;
    const avatarUrl = u.avatar
      ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith('a_')?'gif':'png'}?size=128`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;
    avatar.src = avatarUrl;
    const status = data.discord_status || 'offline';
    dot.className = `profile-status-dot ${status}`;
    name.textContent = u.global_name || u.username;
    handle.textContent = '@' + u.username;

    if(activity){
      let line = '';
      const spotify = data.listening_to_spotify ? data.spotify : null;
      const act = (data.activities || []).find(a => a.type !== 4 && a.name !== 'Spotify');
      if(spotify) line = `♪ ${spotify.song} — ${spotify.artist}`;
      else if(act) line = act.name;
      activity.textContent = line;
    }
  };

  window.loadLanyard = async function(){
    if(!document.getElementById('pfAvatar')) return;
    try{
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const json = await res.json();
      if(!json.success) throw new Error('no data');
      lastLanyardData = json.data;
      lanyardStatus = 'ok';
    }catch(e){ lastLanyardData = null; lanyardStatus = 'error'; }
    renderLanyard();
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    if(document.getElementById('pfAvatar')){
      loadLanyard();
      setInterval(loadLanyard, 25000);
    }
  });
})();

let reposStatus = 'loading';
let lastRepos = null;
(function(){
  window.renderRepos = function(){
    const list = document.getElementById('ghRepoList');
    if(!list) return;
    if(reposStatus === 'loading'){
      list.innerHTML = `<div class="status-fallback">${translations["repos.loading"][currentLang]}</div>`;
      return;
    }
    if(reposStatus === 'error'){
      list.innerHTML = `<div class="status-fallback">${extra.repoError[currentLang]}</div>`;
      return;
    }
    if(!lastRepos || lastRepos.length === 0){
      list.innerHTML = `<div class="status-fallback">${extra.repoEmpty[currentLang]}</div>`;
      return;
    }
    list.innerHTML = lastRepos.map(r => `
      <div class="gh-repo">
        <a class="r-name" href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
        <span class="r-meta">★ ${r.stargazers_count} · ${r.language || '—'}</span>
      </div>`).join('');
  };

  window.loadRepos = function(){
    if(!document.getElementById('ghRepoList')) return;
    fetch('https://api.github.com/users/6p99/repos?sort=updated&per_page=10')
      .then(r => r.json())
      .then(repos => { lastRepos = Array.isArray(repos) ? repos : []; reposStatus = 'ok'; renderRepos(); })
      .catch(() => { reposStatus = 'error'; renderRepos(); });
  };
  document.addEventListener('DOMContentLoaded', loadRepos);
})();

let guestbookStatus = 'loading'; // loading | ok | error
let lastGuestbookEntries = [];
let guestbookMessage = null;
(function(){
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  window.renderGuestbook = function(){
    const notice = document.getElementById('gbNotice');
    if(notice){
      notice.textContent = guestbookMessage === 'rateLimited' ? translations["gb.rateLimited"][currentLang] : '';
    }
    const list = document.getElementById('gbList');
    if(!list) return;
    if(guestbookStatus === 'loading'){
      list.innerHTML = `<div class="status-fallback" style="padding:20px;">${translations["repos.loading"][currentLang]}</div>`;
      return;
    }
    if(guestbookStatus === 'error'){
      list.innerHTML = `<div class="status-fallback" style="padding:20px;">${translations["gb.notConfigured"][currentLang]}</div>`;
      return;
    }
    if(!lastGuestbookEntries || lastGuestbookEntries.length === 0){
      list.innerHTML = `<div class="status-fallback" style="padding:20px;">${translations["gb.empty"][currentLang]}</div>`;
      return;
    }
    list.innerHTML = lastGuestbookEntries.slice().reverse().map(e => `
      <div class="gb-entry">
        <span class="gb-name">${escapeHtml(e.name)}</span><span class="gb-time">${new Date(e.time).toLocaleString()}</span>
        <div class="gb-msg">${escapeHtml(e.msg)}</div>
      </div>`).join('');
  };

  window.loadGuestbook = async function(){
    try{
      const res = await fetch('/api/guestbook');
      if(!res.ok) throw new Error('bad response');
      lastGuestbookEntries = await res.json();
      guestbookStatus = 'ok';
    }catch(e){ guestbookStatus = 'error'; }
    renderGuestbook();
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementById('gbForm');
    if(!form) return;
    loadGuestbook();
    form.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const name = document.getElementById('gbName').value.trim();
      const msg = document.getElementById('gbMsg').value.trim();
      const hp = document.getElementById('gbHp').value.trim();
      if(!name || !msg) return;
      const btn = form.querySelector('button');
      btn.disabled = true;
      try{
        const res = await fetch('/api/guestbook', {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ name, msg, hp })
        });
        if(res.status === 429){
          guestbookMessage = 'rateLimited';
          renderGuestbook();
        }else if(!res.ok){
          throw new Error('failed');
        }else{
          lastGuestbookEntries = await res.json();
          guestbookStatus = 'ok';
          guestbookMessage = null;
          form.reset();
          renderGuestbook();
        }
      }catch(e){
        guestbookStatus = 'error';
        renderGuestbook();
      }
      btn.disabled = false;
    });
  });
})();

(function(){
  document.addEventListener('DOMContentLoaded', async ()=>{
    const el = document.getElementById('visitCount');
    if(!el) return;
    try{
      const res = await fetch('/api/visits');
      if(!res.ok) throw new Error('bad response');
      const data = await res.json();
      el.textContent = data.count;
    }catch(e){
      el.textContent = '—';
    }
  });
})();

const BLACK_INVITE_CODE = 'nT4vpMvaST';
let blackServerStatus = 'loading';
let blackServerData = null;
(function(){
  window.renderBlackServer = function(){
    const statsEl = document.getElementById('serverStats');
    if(!statsEl) return;
    const joinUrl = `https://discord.gg/${BLACK_INVITE_CODE}`;
    const joinBtn = document.getElementById('serverJoin');
    const cardLink = document.getElementById('blackServerLink');
    if(joinBtn){ joinBtn.href = joinUrl; joinBtn.textContent = translations['server.join'][currentLang]; }
    if(cardLink) cardLink.href = joinUrl;

    if(blackServerStatus === 'ok' && blackServerData){
      statsEl.innerHTML = `<span><span class="dot"></span>${blackServerData.online} ${translations['server.online'][currentLang]}</span><span>${blackServerData.members} ${translations['server.members'][currentLang]}</span>`;
    }else if(blackServerStatus === 'error'){
      statsEl.innerHTML = `<span class="status-fallback">${translations['server.error'][currentLang]}</span>`;
    }else{
      statsEl.innerHTML = `<span class="status-fallback">${translations['status.connecting'][currentLang]}</span>`;
    }
  };

  window.loadBlackServer = function(){
    if(!document.getElementById('serverStats')) return;
    fetch(`https://discord.com/api/v10/invites/${BLACK_INVITE_CODE}?with_counts=true`)
      .then(r => r.json())
      .then(data => {
        if(!data.approximate_member_count) throw new Error('no data');
        blackServerData = { online: data.approximate_presence_count, members: data.approximate_member_count };
        blackServerStatus = 'ok';
        renderBlackServer();
      })
      .catch(() => { blackServerStatus = 'error'; renderBlackServer(); });
  };
  document.addEventListener('DOMContentLoaded', loadBlackServer);
})();

const OWNER_DISCORD_ID = '803662340465229855';
let serversStatus = 'loading';
let lastServers = [];

(function(){
  window.renderServers = function(){
    const grid = document.getElementById('serverGrid');
    if(grid){
      if(serversStatus === 'loading'){
        grid.innerHTML = `<div class="status-fallback">${translations['status.connecting'][currentLang]}</div>`;
      }else if(serversStatus === 'error'){
        grid.innerHTML = `<div class="status-fallback">${translations['server.error'][currentLang]}</div>`;
      }else if(lastServers.length === 0){
        grid.innerHTML = `<div class="status-fallback">${translations['servers.empty'][currentLang]}</div>`;
      }else{
        grid.innerHTML = lastServers.map(s => {
          const iconUrl = s.icon
            ? `https://cdn.discordapp.com/icons/${s.id}/${s.icon}.png?size=64`
            : null;
          const iconHtml = iconUrl
            ? `<img src="${iconUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`
            : s.name.charAt(0).toUpperCase();
          return `
          <div class="server-card ltr">
            <div class="server-icon">${iconHtml}</div>
            <div class="server-info">
              <div class="server-name">${s.name}</div>
              <div style="font-size:12px; color:var(--dim); margin-top:2px;">${s.desc || ''}</div>
              <div class="server-stats" data-stats="${s.id}">
                <span><span class="dot"></span>—</span>
                <span>— members</span>
              </div>
            </div>
            <a class="server-join" href="https://discord.gg/${s.invite}" target="_blank" rel="noopener">${translations['server.join'][currentLang]}</a>
          </div>`;
        }).join('');

        lastServers.forEach(s => {
          fetch(`https://discord.com/api/v10/invites/${s.invite}?with_counts=true`)
            .then(r => r.json())
            .then(data => {
              if(!data.approximate_member_count) throw new Error('no data');
              const el = document.querySelector(`[data-stats="${s.id}"]`);
              if(el) el.innerHTML = `<span><span class="dot"></span>${data.approximate_presence_count} ${translations['server.online'][currentLang]}</span><span>${data.approximate_member_count} ${translations['server.members'][currentLang]}</span>`;
            })
            .catch(() => {
              const el = document.querySelector(`[data-stats="${s.id}"]`);
              if(el) el.innerHTML = `<span class="status-fallback">${translations['server.error'][currentLang]}</span>`;
            });
        });
      }
    }

    const addWrap = document.getElementById('serverAddWrap');
    if(addWrap) addWrap.style.display = (authUser && authUser.id === OWNER_DISCORD_ID) ? 'block' : 'none';
  };

  window.loadServers = function(){
    if(!document.getElementById('serverGrid')) return;
    fetch('/api/servers')
      .then(r => r.json())
      .then(data => { lastServers = Array.isArray(data) ? data : []; serversStatus = 'ok'; renderServers(); })
      .catch(() => { serversStatus = 'error'; renderServers(); });
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    loadServers();
    const form = document.getElementById('serverAddForm');
    if(!form) return;
    form.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      const invite = document.getElementById('srvInvite').value.trim();
      const desc = document.getElementById('srvDesc').value.trim();
      const notice = document.getElementById('srvAddNotice');
      if(!invite) return;
      const btn = form.querySelector('button');
      btn.disabled = true;
      try{
        const res = await fetch('/api/servers', {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ invite, desc })
        });
        const data = await res.json();
        if(res.status === 409){
          notice.textContent = translations['servers.alreadyAdded'][currentLang];
        }else if(!res.ok){
          notice.textContent = translations['servers.addError'][currentLang];
        }else{
          lastServers = data;
          serversStatus = 'ok';
          notice.textContent = '';
          form.reset();
          renderServers();
        }
      }catch(e){
        notice.textContent = translations['servers.addError'][currentLang];
      }
      btn.disabled = false;
    });
  });
})();

let authUser = null;
(function(){
  window.renderAuth = function(){
    const box = document.getElementById('authBox');
    if(!box) return;
    if(authUser){
      const avatarUrl = authUser.avatar
        ? `https://cdn.discordapp.com/avatars/${authUser.id}/${authUser.avatar}.png?size=64`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
      box.innerHTML = `<img src="${avatarUrl}" alt="" style="width:26px;height:26px;border-radius:50%;">
        <span style="font-size:12px;font-weight:700;">${authUser.username}</span>
        <a href="/api/auth/logout" style="font-size:11px;color:var(--dim);">${translations['auth.logout'][currentLang]}</a>`;
    }else{
      box.innerHTML = `<a href="/api/auth/login" style="font-size:12px;font-weight:700;">${translations['auth.login'][currentLang]}</a>`;
    }
    if(typeof renderServers === 'function') renderServers();
  };

  window.loadAuth = function(){
    if(!document.getElementById('authBox')) return;
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => { authUser = data.user; renderAuth(); })
      .catch(() => { authUser = null; renderAuth(); });
  };
  document.addEventListener('DOMContentLoaded', loadAuth);
})();

function refreshDynamicText(){
  renderIdentity();
  renderLanyard();
  renderRepos();
  renderGuestbook();
  renderBlackServer();
  renderServers();
  renderAuth();
}
