let lastToml = null;
const translations = {
  "nav.home": {en:"home", ar:"الرئيسية"},
  "nav.about": {en:"about", ar:"الهوية"},
  "nav.projects": {en:"projects", ar:"المشاريع"},
  "nav.blog": {en:"blog", ar:"المدونة"},
  "nav.guestbook": {en:"guestbook", ar:"سجل الزوار"},

  "hero.answer": {en:"Discord bot developer.", ar:"مطوّر بوتات ديسكورد."},

  "home.nav.about.title": {en:"about", ar:"الهوية"},
  "home.nav.about.desc": {en:"identity.toml, live from GitHub", ar:"identity.toml، حي من GitHub"},
  "home.nav.projects.title": {en:"projects", ar:"المشاريع"},
  "home.nav.projects.desc": {en:"repos, pulled live from GitHub", ar:"مستودعات، تُسحب حية من GitHub"},
  "home.nav.blog.title": {en:"blog", ar:"المدونة"},
  "home.nav.blog.desc": {en:"notes and devlogs", ar:"ملاحظات ومقالات تقنية"},
  "home.nav.guestbook.title": {en:"guestbook", ar:"سجل الزوار"},
  "home.nav.guestbook.desc": {en:"leave a message", ar:"اترك رسالة"},

  "status.connecting": {en:"connecting…", ar:"جاري الاتصال…"},
  "status.label": {en:"live status", ar:"الحالة الحية"},
  "repos.label": {en:"repos", ar:"المستودعات"},
  "visits.label": {en:"visits", ar:"زيارة"},

  "section.identity.title": {en:"identity.toml", ar:"identity.toml"},
  "section.identity.loading": {en:"pulling from GitHub…", ar:"جاري السحب من GitHub…"},
  "section.stack.title": {en:"stack", ar:"الأدوات"},

  "repos.loading": {en:"loading repositories from GitHub…", ar:"جاري تحميل المستودعات من GitHub…"},

  "blog.title": {en:"blog", ar:"المدونة"},
  "blog.lede": {en:"Devlogs and notes", ar:"مقالات وملاحظات"},
  "blog.empty.title": {en:"nothing published yet", ar:"ولا مقالة منشورة لسا"},
  "blog.empty.desc": {en:"check back later, or follow the GitHub activity in the meantime.", ar:"ارجع لاحقاً، أو تابع نشاطي على GitHub لحد هيك."},

  "guestbook.title": {en:"guestbook", ar:"سجل الزوار"},
  "gb.name.placeholder": {en:"your name", ar:"اسمك"},
  "gb.msg.placeholder": {en:"your message…", ar:"رسالتك…"},
  "gb.submit": {en:"sign the guestbook", ar:"وقّع بسجل الزوار"},
  "gb.empty": {en:"no messages yet — be the first.", ar:"ولا رسالة لسا — كون أول وحد."},
  "gb.notConfigured": {en:"guestbook backend isn't connected yet.", ar:"سجل الزوار مش موصول بقاعدة بيانات لسا."},

  "contact.title": {en:"contact", ar:"تواصل"},
  "about.title": {en:"about", ar:"الهوية"},
  "projects.title": {en:"projects", ar:"المشاريع"}
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
  const page = document.body.dataset.page;
  document.querySelectorAll('.navlinks a').forEach(tab=>{
    if(tab.dataset.page === page) tab.classList.add('active');
  });
  applyLang(currentLang);
});

(function(){
  function tick(){
    const el = document.getElementById('clock');
    if(!el) return;
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone:'Asia/Amman', hour:'2-digit', minute:'2-digit', hour12:false });
    el.textContent = fmt.format(new Date()) + ' AMM';
  }
  tick(); setInterval(tick, 1000);
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

function renderIdentity(){
  const box = document.getElementById('identityBox');
  if(!box) return;
  if(identityStatus === 'ok') box.textContent = lastToml;
  else if(identityStatus === 'error') box.textContent = extra.identityError[currentLang];
  else box.textContent = translations["section.identity.loading"][currentLang];
}

let lanyardStatus = 'loading';
let lastLanyardData = null;
(function(){
  const DISCORD_ID = '803662340465229855';
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  window.renderLanyard = function(){
    const box = document.getElementById('lanyardBox');
    if(!box) return;
    if(lanyardStatus === 'loading'){
      box.innerHTML = `<div class="status-fallback">${translations["status.connecting"][currentLang]}</div>`;
      return;
    }
    if(lanyardStatus === 'error' || !lastLanyardData){
      box.innerHTML = `<div class="status-fallback">${extra.statusFallback[currentLang]}</div>`;
      return;
    }
    const data = lastLanyardData;
    const u = data.discord_user;
    const avatarUrl = u.avatar
      ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${u.avatar.startsWith('a_')?'gif':'png'}?size=128`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;
    const status = data.discord_status || 'offline';
    let activityLine = '';
    const spotify = data.listening_to_spotify ? data.spotify : null;
    const activity = (data.activities || []).find(a => a.type !== 4 && a.name !== 'Spotify');
    if(spotify) activityLine = `<div class="activity">♪ ${escapeHtml(spotify.song)} — ${escapeHtml(spotify.artist)}</div>`;
    else if(activity) activityLine = `<div class="activity">${escapeHtml(activity.name)}</div>`;

    box.innerHTML = `
      <div class="status-card">
        <div class="status-avatar-wrap">
          <img class="status-avatar" src="${avatarUrl}" alt="avatar">
          <span class="status-dot ${status}"></span>
        </div>
        <div class="status-text">
          <div class="name">${escapeHtml(u.global_name || u.username)}</div>
          <div class="state">${extra.stateLabel[status] ? extra.stateLabel[status][currentLang] : status}</div>
          ${activityLine}
        </div>
      </div>`;
  };

  window.loadLanyard = async function(){
    if(!document.getElementById('lanyardBox')) return;
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
    if(document.getElementById('lanyardBox')){
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
    if(list){
      if(reposStatus === 'loading'){
        list.innerHTML = `<div class="status-fallback">${translations["repos.loading"][currentLang]}</div>`;
      }else if(reposStatus === 'error'){
        list.innerHTML = `<div class="status-fallback">${extra.repoError[currentLang]}</div>`;
      }else if(!lastRepos || lastRepos.length === 0){
        list.innerHTML = `<div class="status-fallback">${extra.repoEmpty[currentLang]}</div>`;
      }else{
        list.innerHTML = lastRepos.map(r => `
          <div class="gh-repo">
            <a class="r-name" href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a>
            <span class="r-meta">★ ${r.stargazers_count} · ${r.language || '—'}</span>
          </div>`).join('');
      }
    }
    const countEl = document.getElementById('repoCount');
    if(countEl) countEl.textContent = reposStatus === 'ok' && lastRepos ? lastRepos.length : '—';
  };

  window.loadRepos = function(){
    if(!document.getElementById('ghRepoList') && !document.getElementById('repoCount')) return;
    fetch('https://api.github.com/users/6p99/repos?sort=updated&per_page=10')
      .then(r => r.json())
      .then(repos => { lastRepos = Array.isArray(repos) ? repos : []; reposStatus = 'ok'; renderRepos(); })
      .catch(() => { reposStatus = 'error'; renderRepos(); });
  };
  document.addEventListener('DOMContentLoaded', loadRepos);
})();

let guestbookStatus = 'loading';
let lastGuestbookEntries = [];
(function(){
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  window.renderGuestbook = function(){
    const list = document.getElementById('gbList');
    if(!list) return;
    if(guestbookStatus === 'loading'){
      list.innerHTML = `<div class="status-fallback" style="padding:20px 0;">${translations["repos.loading"][currentLang]}</div>`;
      return;
    }
    if(guestbookStatus === 'error'){
      list.innerHTML = `<div class="status-fallback" style="padding:20px 0;">${translations["gb.notConfigured"][currentLang]}</div>`;
      return;
    }
    if(!lastGuestbookEntries || lastGuestbookEntries.length === 0){
      list.innerHTML = `<div class="status-fallback" style="padding:20px 0;">${translations["gb.empty"][currentLang]}</div>`;
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
      if(!name || !msg) return;
      const btn = form.querySelector('button');
      btn.disabled = true;
      try{
        const res = await fetch('/api/guestbook', {
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify({ name, msg })
        });
        if(!res.ok) throw new Error('failed');
        lastGuestbookEntries = await res.json();
        guestbookStatus = 'ok';
        form.reset();
        renderGuestbook();
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

function refreshDynamicText(){
  renderIdentity();
  renderLanyard();
  renderRepos();
  renderGuestbook();
}
