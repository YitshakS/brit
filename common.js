const FORM_WORDS = {
  'יחיד': { dear: 'היקר', invite: 'להזמינך' },
  'יחידה': { dear: 'היקרה', invite: 'להזמינך' },
  'רבים': { dear: 'היקרים', invite: 'להזמינכם' },
  'רבות': { dear: 'היקרות', invite: 'להזמינכן' }
};

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ניקוי טלפון, זהה ל-digits_ בשרת: נייד ישראלי נשמר ב-8 ספרות (בלי 05), מספר מחו"ל (10 עד 15 ספרות) כמו שהוא, אחר: '' (לא תקין).
function digits9(phone) {
  let d = String(phone || '').replace(/\D/g, '');
  if (d.indexOf('972') === 0 && d.length > 9) d = d.slice(3);
  d = d.replace(/^0+/, '');
  if (d.length === 9 && d[0] === '5') return d.slice(1);
  if (d.length >= 10 && d.length <= 15) return d;
  return '';
}

// המספר המלא לוואטסאפ (wa.me)
function waNumber(phone) {
  const n = digits9(phone);
  return n.length === 8 ? '9725' + n : n;
}

async function getInvitation(id) {
  if (!CONFIG.API_URL) return mockApi('get', { id });
  const r = await fetch(CONFIG.API_URL + '?id=' + encodeURIComponent(id));
  return r.json();
}

// POST כמחרוזת (text/plain) כדי להימנע מ-preflight של CORS מול Apps Script
async function api(action, data) {
  if (!CONFIG.API_URL) return mockApi(action, data || {});
  // keepalive: בקשת האישור תושלם גם אם המוזמן סוגר את הדף מיד אחרי הלחיצה
  const r = await fetch(CONFIG.API_URL, { method: 'POST', body: JSON.stringify(Object.assign({ action }, data)), keepalive: action === 'rsvp' });
  return r.json();
}

// ---------- מצב דמו ----------
function mockApi(action, d) {
  const key = 'mockGuests';
  let gs = JSON.parse(localStorage.getItem(key) || 'null');
  if (!gs) {
    gs = [
      { id: 'demo1', first: 'דוד', last: 'כהן', display: 'דוד', form: 'יחיד', phone: '050-1234567', table: '1', viewed: '', count: null, sent: '', note: '' },
      { id: 'demo2', first: 'רחל', last: 'לוי', display: 'משפחת לוי', form: 'רבים', phone: '052-7654321', table: '2', viewed: new Date().toISOString(), count: null, sent: new Date().toISOString(), note: '' },
      { id: 'demo3', first: 'שרה', last: 'מזרחי', display: 'שרה', form: 'יחידה', phone: '054-1112233', table: '2', viewed: new Date().toISOString(), count: 3, sent: new Date().toISOString(), note: '' }
    ];
  }
  const save = () => localStorage.setItem(key, JSON.stringify(gs));
  const find = id => gs.find(g => g.id === id);
  let out = { ok: true };
  if (action === 'get') {
    const g = find(d.id);
    if (!g) out = { ok: false, error: 'not_found' };
    else { g.viewed = new Date().toISOString(); out = { ok: true, display: g.display || g.first, form: g.form, count: g.count }; }
  } else if (action === 'rsvp') { const g = find(d.id); if (g) g.count = Number(d.count); }
  else if (action === 'list') out = { ok: true, guests: gs };
  else if (action === 'add') {
    (d.guests || []).forEach(x => gs.push({ id: 'demo' + Date.now() + Math.random().toString(36).slice(2, 5), first: x.first, last: x.last || '', display: x.display || '', form: x.form || 'יחיד', phone: x.phone, table: x.table || '', viewed: '', count: null, sent: '', note: x.note || '' }));
    out = { ok: true, added: (d.guests || []).length, duplicates: [] };
  } else if (action === 'setSent') { const g = find(d.id); if (g) g.sent = d.sent ? new Date().toISOString() : ''; }
  else if (action === 'preview') {
    const g = find(d.id);
    out = g ? { ok: true, display: g.display || g.first, form: g.form, count: g.count } : { ok: false, error: 'not_found' };
  }
  else if (action === 'delete') {
    const i = gs.findIndex(g => g.id === (d.guest || {}).id);
    if (i < 0) out = { ok: false, error: 'not_found' }; else gs.splice(i, 1);
  }
  else if (action === 'update') { const g = find(d.id); if (g) Object.assign(g, d.fields); }
  save();
  return Promise.resolve(out);
}
