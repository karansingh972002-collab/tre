const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 8080);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'production-db.json');
const MAX_BODY = 8 * 1024 * 1024;
const referenceProductImage = '/Users/harshaweb/Downloads/untitled folder/WhatsApp Image 2026-08-11 at 13.52.04.jpeg';
const homeRechargeImage = path.join(__dirname, 'assets', 'home-recharge-preview.png');
const productCardImage = path.join(__dirname, 'assets', 'product-card-box.png');
const svipProductCardImage = path.join(__dirname, 'assets', 'svip-product-card-box.png');

const defaultPlans = [
  { name: 'VIP-1', type: 'VIP', price: 550, daily: 30, total: 3000, days: 100, slots: 100 },
  { name: 'VIP-2', type: 'VIP', price: 1500, daily: 80, total: 8000, days: 100, slots: 80 },
  { name: 'VIP-3', type: 'VIP', price: 3000, daily: 150, total: 15000, days: 100, slots: 60 },
  { name: 'VIP-4', type: 'VIP', price: 5000, daily: 220, total: 22000, days: 100, slots: 40 },
  { name: 'VIP-5', type: 'VIP', price: 8000, daily: 400, total: 40000, days: 100, slots: 30 },
  { name: 'VIP-6', type: 'VIP', price: 12000, daily: 600, total: 60000, days: 100, slots: 20 },
  { name: 'VIP-7', type: 'VIP', price: 18000, daily: 800, total: 80000, days: 100, slots: 15 },
  { name: 'SVIP-1', type: 'SVIP', price: 1200, daily: 50, total: 5000, days: 100, slots: 10 },
  { name: 'SVIP-2', type: 'SVIP', price: 3000, daily: 150, total: 15000, days: 100, slots: 10 },
  { name: 'SVIP-3', type: 'SVIP', price: 6000, daily: 300, total: 30000, days: 100, slots: 10 },
  { name: 'SVIP-4', type: 'SVIP', price: 12000, daily: 600, total: 60000, days: 100, slots: 10 },
  { name: 'SVIP-5', type: 'SVIP', price: 18000, daily: 800, total: 80000, days: 100, slots: 10 },
];

function planNumber(plan) {
  const match = String(plan.name || '').match(/(\d+)/);
  return match ? Number(match[1]) : 999;
}

function comparePlans(a, b) {
  const typeOrder = { VIP: 1, SVIP: 2 };
  return (typeOrder[a.type] || 9) - (typeOrder[b.type] || 9) || planNumber(a) - planNumber(b) || a.name.localeCompare(b.name);
}

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    writeDb({
      users: [],
      sessions: {},
      plans: defaultPlans,
      transactions: [],
      investments: [],
      support: [],
      complaints: [],
      settings: { paymentDetail: 'demo@upi', qr: '' },
      createdAt: new Date().toISOString(),
    });
  }
}

function readDb() {
  ensureDb();
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  if (!Array.isArray(db.plans)) db.plans = defaultPlans;
  db.plans = db.plans.filter((p) => Number(p.price) >= 550 && Number(p.price) <= 18000);
  defaultPlans.forEach((plan) => {
    if (!db.plans.some((p) => p.name === plan.name)) db.plans.push(plan);
  });
  db.plans.sort(comparePlans);
  if (!db.settings) db.settings = { paymentDetail: 'demo@upi', qr: '' };
  if (!db.sessions) db.sessions = {};
  ['users', 'transactions', 'investments', 'support', 'complaints'].forEach((key) => {
    if (!Array.isArray(db[key])) db[key] = [];
  });
  return db;
}

function writeDb(db) {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function send(res, code, body, headers = {}) {
  const isObject = typeof body === 'object' && body !== null && !Buffer.isBuffer(body);
  res.writeHead(code, {
    'Content-Type': isObject ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(isObject ? JSON.stringify(body) : body);
}

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((item) => {
    const index = item.indexOf('=');
    return [decodeURIComponent(item.slice(0, index).trim()), decodeURIComponent(item.slice(index + 1).trim())];
  }));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > MAX_BODY) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function id(prefix) {
  return prefix + '_' + crypto.randomBytes(9).toString('hex');
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  return hashPassword(password, salt) === stored;
}

function today() {
  return new Date().toLocaleDateString('en-IN');
}

function generateUtr() {
  return 'UTR' + Date.now().toString().slice(-8) + Math.floor(100000 + Math.random() * 900000);
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function getSession(req, db) {
  const token = parseCookies(req).amp_session;
  if (!token || !db.sessions[token]) return { token: null, session: null, user: null };
  const session = db.sessions[token];
  const user = session.userId ? db.users.find((u) => u.id === session.userId) : null;
  return { token, session, user };
}

function requireUser(req, db) {
  const context = getSession(req, db);
  if (!context.user) throw Object.assign(new Error('Login required'), { status: 401 });
  return context;
}

function requireAdmin(req, db) {
  const context = getSession(req, db);
  if (!context.session || !context.session.admin) throw Object.assign(new Error('Admin required'), { status: 403 });
  return context;
}

function setSessionCookie(token) {
  return `amp_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax`;
}

function clearSessionCookie() {
  return 'amp_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

function apiState(req, res, db) {
  const { user, session } = getSession(req, db);
  send(res, 200, {
    user: publicUser(user),
    admin: Boolean(session && session.admin),
    plans: db.plans,
    settings: db.settings,
    transactions: user ? db.transactions.filter((t) => t.userId === user.id) : [],
    investments: user ? db.investments.filter((i) => i.userId === user.id) : [],
    support: user ? db.support.filter((s) => s.userId === user.id) : [],
    complaints: user ? db.complaints.filter((c) => c.userId === user.id) : [],
  });
}

async function handleApi(req, res) {
  const db = readDb();
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === 'GET' && url.pathname === '/api/state') return apiState(req, res, db);
    if (req.method === 'GET' && url.pathname === '/api/admin') {
      requireAdmin(req, db);
      return send(res, 200, { ...db, users: db.users.map(publicUser) });
    }

    const body = await readBody(req);

    if (req.method === 'POST' && url.pathname === '/api/register') {
      const phone = String(body.phone || '').trim();
      if (!phone || !body.password || !body.name) throw Object.assign(new Error('Name, phone, and password are required'), { status: 400 });
      if (db.users.some((u) => u.phone === phone)) throw Object.assign(new Error('Mobile number already registered'), { status: 409 });
      const user = {
        id: id('usr'),
        name: String(body.name).trim(),
        phone,
        passwordHash: hashPassword(body.password),
        ref: String(body.ref || '').trim().toUpperCase(),
        code: 'INV' + crypto.randomBytes(4).toString('hex').toUpperCase(),
        balance: 0,
        income: 0,
        bonus: 0,
        plan: '',
        joined: today(),
        status: 'active',
      };
      const token = id('ses');
      db.users.push(user);
      db.sessions[token] = { userId: user.id, admin: false, createdAt: new Date().toISOString() };
      writeDb(db);
      return send(res, 200, { user: publicUser(user) }, { 'Set-Cookie': setSessionCookie(token) });
    }

    if (req.method === 'POST' && url.pathname === '/api/login') {
      const user = db.users.find((u) => u.phone === String(body.phone || '').trim());
      if (!user || !verifyPassword(body.password, user.passwordHash)) throw Object.assign(new Error('Wrong mobile or password'), { status: 401 });
      const token = id('ses');
      db.sessions[token] = { userId: user.id, admin: false, createdAt: new Date().toISOString() };
      writeDb(db);
      return send(res, 200, { user: publicUser(user) }, { 'Set-Cookie': setSessionCookie(token) });
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/login') {
      if (String(body.password || '') !== ADMIN_PASSWORD) throw Object.assign(new Error('Wrong admin password'), { status: 401 });
      const token = id('adm');
      db.sessions[token] = { admin: true, createdAt: new Date().toISOString() };
      writeDb(db);
      return send(res, 200, { ok: true }, { 'Set-Cookie': setSessionCookie(token) });
    }

    if (req.method === 'POST' && url.pathname === '/api/logout') {
      const { token } = getSession(req, db);
      if (token) delete db.sessions[token];
      writeDb(db);
      return send(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });
    }

    if (req.method === 'POST' && url.pathname === '/api/recharge') {
      const { user } = requireUser(req, db);
      const amount = Number(body.amount);
      if (!Number.isFinite(amount) || amount < 100) throw Object.assign(new Error('Minimum recharge is Rs 100'), { status: 400 });
      const utr = generateUtr();
      user.balance += amount;
      db.transactions.push({ id: id('txn'), userId: user.id, date: today(), type: 'recharge', method: body.method || 'UPI', amount, utr, status: 'success' });
      writeDb(db);
      return send(res, 200, { utr, balance: user.balance });
    }

    if (req.method === 'POST' && url.pathname === '/api/withdraw') {
      const { user } = requireUser(req, db);
      const amount = Number(body.amount);
      if (!Number.isFinite(amount) || amount < 100) throw Object.assign(new Error('Minimum withdrawal is Rs 100'), { status: 400 });
      if (amount > user.balance) throw Object.assign(new Error('Insufficient wallet balance'), { status: 400 });
      user.balance -= amount;
      db.transactions.push({ id: id('txn'), userId: user.id, date: today(), type: 'withdraw', amount, to: body.to || '', status: 'pending' });
      writeDb(db);
      return send(res, 200, { balance: user.balance });
    }

    if (req.method === 'POST' && url.pathname === '/api/buy') {
      const { user } = requireUser(req, db);
      const plan = db.plans.find((p) => p.name === body.name);
      if (!plan) throw Object.assign(new Error('Plan not found'), { status: 404 });
      if (user.balance < plan.price) throw Object.assign(new Error('Recharge wallet before buying this plan'), { status: 400 });
      user.balance -= plan.price;
      user.plan = plan.name;
      user.income += plan.daily;
      db.investments.push({ id: id('inv'), userId: user.id, plan: plan.name, price: plan.price, daily: plan.daily, total: plan.total, days: plan.days, date: today() });
      db.transactions.push({ id: id('txn'), userId: user.id, date: today(), type: 'plan purchase', amount: plan.price, status: 'active' });
      const sponsor = db.users.find((u) => u.code === user.ref);
      if (sponsor) {
        const bonus = Math.round(plan.price * 0.1);
        sponsor.balance += bonus;
        sponsor.bonus += bonus;
        db.transactions.push({ id: id('txn'), userId: sponsor.id, date: today(), type: 'referral bonus', amount: bonus, status: 'success' });
      }
      writeDb(db);
      return send(res, 200, { ok: true });
    }

    if (req.method === 'POST' && url.pathname === '/api/support') {
      const { user } = requireUser(req, db);
      db.support.push({ id: id('sup'), userId: user.id, date: today(), subject: body.subject || '', message: body.message || '', status: 'open' });
      writeDb(db);
      return send(res, 200, { ok: true });
    }

    if (req.method === 'POST' && url.pathname === '/api/complaint') {
      const { user } = requireUser(req, db);
      db.complaints.push({
        id: id('cmp'),
        userId: user.id,
        date: today(),
        utr: String(body.utr || '').trim().toUpperCase(),
        amount: Number(body.amount || 0),
        method: body.method || 'UPI',
        issue: body.issue || 'Payment issue',
        message: body.message || '',
        status: 'pending',
      });
      writeDb(db);
      return send(res, 200, { ok: true });
    }

    if (url.pathname.startsWith('/api/admin/')) {
      requireAdmin(req, db);
      if (req.method === 'POST' && url.pathname === '/api/admin/settings') {
        db.settings.paymentDetail = String(body.paymentDetail || '');
        if ('qr' in body) db.settings.qr = String(body.qr || '');
        writeDb(db);
        return send(res, 200, { settings: db.settings });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/plan') {
        const plan = {
          name: String(body.name || '').trim().toUpperCase(),
          type: body.type === 'SVIP' ? 'SVIP' : 'VIP',
          price: Number(body.price),
          daily: Number(body.daily),
          total: Number(body.total),
          days: Number(body.days || 100),
          slots: Number(body.slots || 10),
        };
        if (!plan.name || plan.price < 550 || plan.price > 18000) throw Object.assign(new Error('Plan amount must be Rs 550 to Rs 18,000'), { status: 400 });
        db.plans = db.plans.filter((p) => p.name !== body.originalName && p.name !== plan.name);
        db.plans.push(plan);
        db.plans.sort(comparePlans);
        writeDb(db);
        return send(res, 200, { plans: db.plans });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/delete-plan') {
        db.plans = db.plans.filter((p) => p.name !== body.name);
        writeDb(db);
        return send(res, 200, { plans: db.plans });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/tx-status') {
        const tx = db.transactions.find((t) => t.id === body.id);
        if (tx) tx.status = body.status;
        writeDb(db);
        return send(res, 200, { ok: true });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/complaint-status') {
        const complaint = db.complaints.find((c) => c.id === body.id);
        if (complaint) complaint.status = body.status;
        writeDb(db);
        return send(res, 200, { ok: true });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/user-balance') {
        const user = db.users.find((u) => u.id === body.userId);
        if (user) {
          const amount = Number(body.amount || 0);
          user.balance += amount;
          db.transactions.push({ id: id('txn'), userId: user.id, date: today(), type: 'admin adjustment', amount, status: 'success' });
        }
        writeDb(db);
        return send(res, 200, { ok: true });
      }
      if (req.method === 'POST' && url.pathname === '/api/admin/reset') {
        writeDb({ users: [], sessions: {}, plans: defaultPlans, transactions: [], investments: [], support: [], complaints: [], settings: { paymentDetail: 'demo@upi', qr: '' } });
        return send(res, 200, { ok: true });
      }
    }

    send(res, 404, { error: 'Not found' });
  } catch (error) {
    send(res, error.status || 500, { error: error.message || 'Server error' });
  }
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Legacy Production</title>
  <style>
    *{box-sizing:border-box} body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:#f5f7fb;color:#152033} button,input,select,textarea{font:inherit} button{cursor:pointer}
    body:before{content:"";position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 18% 12%,rgba(255,137,8,.16),transparent 28%),radial-gradient(circle at 82% 6%,rgba(23,165,107,.14),transparent 28%),linear-gradient(180deg,#fff,#f5f7fb 40%,#eef3f8)}
    header{position:sticky;top:0;z-index:5;background:rgba(255,255,255,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(207,216,229,.72);box-shadow:0 12px 34px rgba(20,30,50,.1)}header:before{content:"";display:block;height:3px;background:linear-gradient(90deg,#17a56b,#ff8908,#0d6efd)} .bar{max-width:1180px;margin:auto;padding:10px 16px 12px;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap}
    .brand{display:flex;align-items:center;gap:10px;font-weight:950;color:#0f172a}.brand span{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,#101827,#17a56b 48%,#ff8908);color:white;box-shadow:0 10px 24px rgba(23,165,107,.32)}.brand-copy{display:grid;gap:1px}.brand-copy strong{font-size:22px;line-height:1}.brand-copy small{color:#64748b;font-size:11px;font-weight:850;text-transform:uppercase}
    nav{display:flex;gap:6px;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:6px;border:1px solid rgba(207,216,229,.72);background:rgba(248,250,252,.72);border-radius:8px}.btn,nav button{border:1px solid #cfd8e5;background:white;color:#1f2b3d;border-radius:8px;min-height:38px;padding:8px 12px;font-weight:800}.primary{background:#17a56b!important;border-color:#17a56b!important;color:#fff!important}.warn{background:#ff8908!important;border-color:#ff8908!important;color:#fff!important}.danger{background:#ef4444!important;border-color:#ef4444!important;color:#fff!important}.blue{background:#0d6efd!important;border-color:#0d6efd!important;color:#fff!important}nav button{border:0;background:transparent;color:#475569;min-height:36px;padding:8px 11px}nav button:hover{background:#fff;box-shadow:0 8px 18px rgba(22,34,51,.08);color:#0f7d52}nav button.active{background:#111827;color:#fff;box-shadow:0 10px 24px rgba(17,24,39,.22)}
    main{max-width:none;margin:auto;padding:0 0 36px}main>section:not(#home){max-width:1180px;margin:auto;padding:18px 16px 36px}.page{display:none}.page.active{display:block}.hero{display:grid;grid-template-columns:1.05fr .95fr;gap:24px;align-items:center;min-height:76vh;padding:18px 0}.hero h1{font-size:clamp(38px,5.4vw,70px);line-height:.98;margin:0 0 16px;letter-spacing:0}.hero-lead{font-size:18px;line-height:1.7;max-width:620px}.eyebrow{display:inline-flex;align-items:center;gap:8px;border:1px solid #ffd7ad;background:#fff7ed;color:#b45309;border-radius:999px;padding:6px 10px;font-weight:900;font-size:13px;margin-bottom:14px}.muted{color:#64748b}.card,.form{background:#fff;border:1px solid #dce3ee;border-radius:8px;padding:16px;box-shadow:0 8px 28px rgba(20,30,50,.06)}.form{max-width:470px;margin:20px auto}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.two{grid-template-columns:repeat(2,1fr)}.field{display:grid;gap:6px;margin:11px 0}.field label{font-size:13px;font-weight:850;color:#334155}.field input,.field select,.field textarea{width:100%;border:1px solid #cfd8e5;border-radius:8px;padding:10px;min-height:42px}.field textarea{min-height:88px}.password-row{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center}.password-row .btn{min-height:42px;padding:8px 12px;white-space:nowrap}.payment-options{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:12px 0}.payment-option{border:1px solid #dce3ee;border-radius:8px;background:#fff;padding:12px;min-height:92px;display:grid;gap:5px;cursor:pointer}.payment-option strong{display:block}.payment-option span{color:#64748b;font-size:13px;line-height:1.35}.payment-option.active{border-color:#17a56b;background:#f0fbf6}.payment-option:focus-visible{outline:3px solid rgba(23,165,107,.24);outline-offset:2px}.actions{display:flex;gap:8px;flex-wrap:wrap}.value{font-size:26px;font-weight:950}.label{font-size:12px;color:#64748b;text-transform:uppercase;font-weight:900}
    .home-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:22px}.home-stat{background:#fff;border:1px solid #e4eaf2;border-radius:8px;padding:14px;box-shadow:0 10px 30px rgba(20,30,50,.06)}.hero-preview{background:#111827;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:18px;box-shadow:0 26px 70px rgba(17,24,39,.28);overflow:hidden;position:relative}.hero-preview:before{content:"";position:absolute;inset:-35% -20% auto 35%;height:330px;background:radial-gradient(circle,rgba(255,137,8,.34),transparent 64%)}.hero-preview>*{position:relative}.wallet-card{background:linear-gradient(135deg,#172033,#0f172a);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:18px;margin-bottom:12px}.wallet-top{display:flex;justify-content:space-between;gap:14px;align-items:start}.wallet-amount{font-size:38px;font-weight:950;margin-top:8px;color:#8ff0bf}.mini-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.mini-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px}.home-plans{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.home-plan{background:#fff;color:#172033;border-radius:8px;padding:12px;border:1px solid #e5eaf2}.home-plan strong{display:block;font-size:19px;margin-bottom:4px}.home-image{background:#fff;border:1px solid #e5eaf2;border-radius:8px;padding:10px;margin:8px 0 22px;box-shadow:0 12px 34px rgba(20,30,50,.08)}.home-image img{display:block;width:100%;max-height:620px;object-fit:contain;border-radius:8px;background:#111827}.home-image-caption{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;padding:12px 6px 2px}.home-image-caption p{margin:4px 0 0}.feature-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.feature{background:#fff;border:1px solid #e5eaf2;border-radius:8px;padding:14px;display:grid;gap:6px}.feature b{font-size:15px}.feature span{color:#64748b;font-size:13px}.detail-band{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:18px 0 22px}.detail-card{background:#fff;border:1px solid #e5eaf2;border-radius:8px;padding:16px;box-shadow:0 8px 24px rgba(20,30,50,.06)}.detail-card h3{margin:0 0 8px}.detail-card p{margin:0;color:#64748b;line-height:1.55}.check-list{list-style:none;margin:12px 0 0;padding:0;display:grid;gap:7px;color:#334155}.check-list li:before{content:"✓";display:inline-grid;place-items:center;width:19px;height:19px;margin-right:7px;border-radius:50%;background:#e8f8f0;color:#0f7d52;font-size:12px;font-weight:950}.timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0 24px;padding:14px;border:1px solid rgba(189,140,255,.28);border-radius:8px;background:radial-gradient(circle at 14% 18%,rgba(255,211,106,.16),transparent 24%),linear-gradient(135deg,#130620,#07111a 62%,#0b2c27);box-shadow:0 22px 58px rgba(7,17,26,.18)}.step{background:linear-gradient(180deg,rgba(255,255,255,.11),rgba(255,255,255,.05));border:1px solid rgba(255,211,106,.18);border-radius:8px;padding:16px;position:relative;overflow:hidden;min-height:178px;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 14px 32px rgba(0,0,0,.18)}.step:before{content:"";position:absolute;inset:0 0 auto;height:4px;background:linear-gradient(90deg,#ffd36a,#8ff0bf)}.step-number{width:42px;height:42px;border-radius:8px;display:grid;place-items:center;background:radial-gradient(circle at 35% 25%,#fff6cf,#ffd36a 44%,#b47a14);color:#17022e;font-weight:950;margin-bottom:14px;box-shadow:0 10px 24px rgba(255,211,106,.22)}.step strong{display:block;margin-bottom:6px;color:#fff;font-size:18px}.step span{color:#d6f7e7;line-height:1.48}.info-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:14px 0 24px}.info-card{background:#fff;border:1px solid #e5eaf2;border-radius:8px;padding:16px;box-shadow:0 8px 24px rgba(20,30,50,.06)}.info-card strong{display:block;margin-bottom:8px}.info-card span{color:#64748b;line-height:1.5}.home-wide{background:radial-gradient(circle at 88% 18%,rgba(255,211,106,.18),transparent 28%),linear-gradient(135deg,#12051f,#07111a 58%,#0e2d2a);border:1px solid rgba(143,240,191,.24);border-radius:8px;padding:18px;box-shadow:0 22px 58px rgba(7,17,26,.24);margin:14px 0 24px;color:#fff;overflow:hidden;position:relative}.home-wide h3{margin:0 0 8px;color:#fff}.home-wide p{margin:0;color:#d6f7e7;line-height:1.6}.wallet-support-layout{display:grid;grid-template-columns:1.15fr .85fr;gap:18px;align-items:stretch}.support-kicker{display:inline-flex;width:fit-content;border:1px solid rgba(255,211,106,.34);border-radius:999px;padding:6px 10px;margin-bottom:10px;background:rgba(255,211,106,.1);color:#ffd36a;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0}.support-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}.stat-list{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:0}.stat-list div{border:1px solid rgba(143,240,191,.2);border-radius:8px;padding:13px;background:rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}.stat-list .label{color:#9ff0c3}.stat-list .value{color:#fff;font-size:20px}.payment-flow{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:14px}.payment-flow span{border:1px solid rgba(255,211,106,.2);border-radius:8px;padding:10px 12px;background:rgba(255,211,106,.08);color:#fff6cf;font-weight:850;text-align:center}.contact-footer{background:#111827;color:#fff;border-radius:8px;padding:14px;margin:16px 0 0;box-shadow:0 18px 45px rgba(17,24,39,.2);display:grid;grid-template-columns:minmax(220px,300px) 1fr;gap:12px;align-items:start}.contact-footer h2{margin:0 0 6px;color:#fff}.contact-footer p{margin:0;color:#cbd5e1;line-height:1.45}.contact-copy{display:grid;gap:10px;align-content:start}.contact-visual{border:1px solid rgba(143,240,191,.26);border-radius:8px;padding:8px;background:linear-gradient(135deg,rgba(20,184,166,.16),rgba(15,23,42,.74));box-shadow:0 18px 42px rgba(20,184,166,.14)}.contact-visual img{display:block;width:100%;aspect-ratio:16/5;max-height:240px;object-fit:cover;border-radius:8px;border:1px solid rgba(143,240,191,.22);background:#07111a;filter:saturate(1.14) brightness(.98) hue-rotate(0deg)}.contact-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;grid-column:1/-1}.contact-card{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);border-radius:8px;padding:11px}.contact-card .label{color:#93c5fd}.contact-card strong{display:block;margin:6px 0;color:#fff}.contact-card span{color:#cbd5e1;line-height:1.45}.auth-popup{position:fixed;inset:0;z-index:1000;display:none;place-items:center;padding:18px;background:rgba(7,17,26,.72);backdrop-filter:blur(8px)}.auth-popup.active{display:grid}.auth-dialog{width:min(430px,100%);border:1px solid rgba(255,211,106,.28);border-radius:8px;padding:18px;background:radial-gradient(circle at 86% 12%,rgba(255,211,106,.18),transparent 30%),linear-gradient(135deg,#17022e,#07111a 62%,#0e2d2a);color:#fff;box-shadow:0 28px 70px rgba(0,0,0,.36)}.auth-dialog h2{margin:0 0 8px;color:#fff}.auth-dialog p{margin:0;color:#d6f7e7;line-height:1.5}.auth-dialog-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px}.auth-close{width:36px;height:36px;padding:0;border-radius:8px;display:grid;place-items:center}.auth-options{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:16px}.auth-option{border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:14px;background:rgba(255,255,255,.08);color:#fff;text-align:left;cursor:pointer}.auth-option strong{display:block;margin-bottom:6px;color:#ffd36a}.auth-option span{color:#d6f7e7;line-height:1.4}.hero{margin-top:14px;padding:28px;min-height:calc(100vh - 104px);border-radius:8px;background:radial-gradient(circle at 78% 18%,rgba(255,211,106,.22),transparent 28%),radial-gradient(circle at 18% 82%,rgba(139,92,246,.28),transparent 30%),linear-gradient(135deg,#16052a,#080213 58%,#1b0a2f);border:1px solid rgba(189,140,255,.46);box-shadow:0 28px 70px rgba(59,11,103,.28);color:#fff;overflow:hidden;position:relative}.hero:before{content:"";position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.08),transparent 36%,rgba(255,211,106,.08));pointer-events:none}.hero>*{position:relative;z-index:1}.hero h1{color:#fff;text-shadow:0 0 24px rgba(189,140,255,.48)}.hero .muted,.hero-lead{color:#e7d3ff}.eyebrow{background:rgba(255,211,106,.12);color:#ffd36a;border-color:rgba(255,211,106,.48)}.hero-preview{background:radial-gradient(circle at 80% 12%,rgba(255,211,106,.22),transparent 30%),linear-gradient(180deg,rgba(139,92,246,.30),transparent 42%),#10021f;border-color:rgba(189,140,255,.42);box-shadow:0 24px 60px rgba(8,2,19,.46)}.hero-preview:before{background:radial-gradient(circle,rgba(255,211,106,.28),transparent 64%)}.home-svip-showcase{position:relative;min-height:235px;border:1px solid rgba(255,211,106,.28);border-radius:8px;overflow:hidden;margin:12px 0 14px;background:#080213;box-shadow:0 18px 44px rgba(0,0,0,.34)}.home-svip-showcase img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.2) brightness(.92) hue-rotate(16deg)}.home-svip-overlay{position:relative;z-index:1;min-height:235px;display:grid;align-content:end;justify-items:center;text-align:center;padding:95px 16px 16px;background:linear-gradient(180deg,transparent,rgba(22,2,46,.76) 48%,rgba(8,2,19,.98))}.home-svip-overlay span{color:#ffd36a;font-size:12px;font-weight:950}.home-svip-overlay strong{color:#fff;font-size:32px;text-shadow:0 0 18px rgba(189,140,255,.8),0 2px 14px rgba(0,0,0,.8)}.home-svip-summary{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;margin-top:-18px;padding:12px;border:1px solid rgba(255,211,106,.34);border-radius:8px;background:linear-gradient(135deg,#18032f,#2a0751);position:relative;z-index:2}.home-svip-badge{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#260848;border:3px solid #ffd36a;color:#fff;font-weight:950;box-shadow:0 0 18px rgba(255,211,106,.62)}.home-svip-summary strong{color:#ffd36a;display:block}.home-svip-summary small{color:#e7d3ff;font-weight:850}.wallet-card{background:linear-gradient(135deg,#18032f,#2a0751);border-color:rgba(255,211,106,.2)}.wallet-amount{color:#ffd36a}.mini-card,.home-plan{background:rgba(255,255,255,.08);border-color:rgba(255,211,106,.22);color:#fff}.home-plan strong{color:#ffd36a}.home-stats .home-stat{background:linear-gradient(135deg,rgba(255,255,255,.13),rgba(255,255,255,.06));border-color:rgba(255,211,106,.24);box-shadow:0 12px 28px rgba(8,2,19,.24)}.home-stats .label{color:#e7d3ff}.home-stats .value{color:#ffd36a}.home-image{background:linear-gradient(135deg,#17022e,#080213);border-color:rgba(189,140,255,.42);box-shadow:0 22px 58px rgba(111,28,191,.24)}.home-image img{background:#0b0414;border:1px solid rgba(255,211,106,.16);aspect-ratio:16/7;max-height:760px;object-fit:cover;filter:saturate(1.2) brightness(.94) hue-rotate(16deg)}.home-image-caption .label{color:#ffd36a}.home-image-caption .muted{color:#e7d3ff}.feature,.detail-card,.info-card{background:linear-gradient(180deg,#fff,#fbf7ff);border-color:rgba(189,140,255,.28);box-shadow:0 14px 34px rgba(111,28,191,.10)}.feature b,.detail-card h3,.info-card strong{color:#2a0751}#home{width:100%;max-width:none;padding:0 0 36px}.hero{min-height:calc(100vh - 92px);margin-top:0;padding:clamp(24px,4vw,56px);border-radius:0;grid-template-columns:1.08fr .92fr}.hero h1{font-size:clamp(42px,6.6vw,86px)}.hero .actions,.hero .home-stats{max-width:760px}.hero-preview{min-height:min(760px,calc(100vh - 150px));padding:clamp(16px,2vw,26px)}.home-svip-showcase{min-height:clamp(280px,34vh,430px)}.home-svip-overlay{min-height:clamp(280px,34vh,430px)}#home>.home-image{margin:26px clamp(14px,3vw,42px) 28px}#home>h2,#home>p,#home>.feature-row,#home>.detail-band,#home>.timeline,#home>.info-grid,#home>.home-wide,#home>.contact-footer{margin-left:clamp(14px,3vw,42px);margin-right:clamp(14px,3vw,42px)}
    .quick{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5eaf2;margin:10px 0 14px}.quick button{border:0;border-right:1px solid #e5eaf2;background:#fff;min-height:74px;color:#ff8908;font-weight:900}.filters{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#fff;border-radius:8px;padding:8px;margin-bottom:14px}.filters button.active{background:#ff8908;color:#fff;border-color:#ff8908}.plan-card{display:grid;gap:12px;padding:0;overflow:hidden;background:#10051f;border-color:#5b237e;color:#fff;box-shadow:0 16px 45px rgba(35,8,54,.22)}.plan-card.svip-card{background:linear-gradient(180deg,#17022e,#080213);border-color:#bd8cff;box-shadow:0 22px 58px rgba(111,28,191,.34),0 0 0 1px rgba(255,211,106,.2)}.svip-card .product-box{border-bottom-color:#bd8cff}.svip-card .product-content{background:linear-gradient(180deg,transparent,rgba(22,2,46,.76) 50%,rgba(8,2,19,.98));padding-top:110px}.svip-card .brand-small{color:#ffd36a}.svip-card .product-title{color:#fff;text-shadow:0 0 18px rgba(189,140,255,.8),0 2px 14px rgba(0,0,0,.8)}.svip-card .product-plan{color:#e7d3ff}.svip-card .plan-summary{background:linear-gradient(135deg,#18032f,#2a0751);border-color:#bd8cff}.svip-card .plan-number{border-color:#ffd36a;box-shadow:0 0 18px rgba(255,211,106,.72);background:#260848}.svip-card .income-value,.svip-card .price-bar b,.svip-card .row b{color:#ffd36a}.svip-card .price-bar{background:linear-gradient(135deg,#3b0b67,#10021f);border-top-color:#bd8cff}.svip-card .btn{background:#8b5cf6!important;border-color:#8b5cf6!important;color:#fff!important}.product-box{min-height:255px;position:relative;display:grid;align-items:end;text-align:center;overflow:hidden;background:#07120d;border-bottom:1px solid #2f6d42}.product-box img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.product-color-0 img{filter:hue-rotate(0deg) saturate(1.08)}.product-color-1 img{filter:hue-rotate(42deg) saturate(1.18)}.product-color-2 img{filter:hue-rotate(86deg) saturate(1.2)}.product-color-3 img{filter:hue-rotate(138deg) saturate(1.18)}.product-color-4 img{filter:hue-rotate(184deg) saturate(1.2)}.product-color-5 img{filter:hue-rotate(228deg) saturate(1.18)}.product-color-6 img{filter:hue-rotate(274deg) saturate(1.15)}.product-color-7 img{filter:hue-rotate(316deg) saturate(1.18)}.product-color-8 img{filter:hue-rotate(24deg) saturate(1.28) brightness(1.08)}.product-color-9 img{filter:hue-rotate(110deg) saturate(1.3) brightness(1.06)}.product-color-10 img{filter:hue-rotate(205deg) saturate(1.26) brightness(1.05)}.product-color-11 img{filter:hue-rotate(292deg) saturate(1.24) brightness(1.06)}.svip-color-0 img{filter:hue-rotate(0deg) saturate(1.16) brightness(1.04)}.svip-color-1 img{filter:hue-rotate(32deg) saturate(1.24) brightness(1.08)}.svip-color-2 img{filter:hue-rotate(74deg) saturate(1.25) brightness(1.06)}.svip-color-3 img{filter:hue-rotate(126deg) saturate(1.22) brightness(1.08)}.svip-color-4 img{filter:hue-rotate(182deg) saturate(1.22) brightness(1.06)}.svip-color-5 img{filter:hue-rotate(246deg) saturate(1.2) brightness(1.08)}.product-content{position:relative;z-index:1;width:100%;padding:92px 14px 16px;background:linear-gradient(180deg,transparent,rgba(3,9,7,.88) 64%,rgba(3,9,7,.96));display:grid;gap:4px;justify-items:center}.brand-small{font-size:13px;color:#f7d66f;font-weight:900;letter-spacing:0}.product-title{font-size:32px;font-weight:950;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.7)}.product-plan{font-size:13px;font-weight:950;color:#d4f7dd}.diamond{display:none}.plan-summary{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:12px;margin:-20px 12px 0;padding:12px 14px;background:#08040d;border:1px solid #7a2aa3;border-radius:8px;position:relative;z-index:2}.plan-number{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#14051f;border:3px solid #8e24ff;color:#f5e9ff;font-size:24px;font-weight:950;box-shadow:0 0 16px rgba(166,72,255,.64)}.plan-summary strong{font-size:20px;color:#ffe178}.income-panel{text-align:center;padding:4px 14px 0}.income-label{font-size:13px;font-weight:950;color:#f6f1ff}.income-value{font-size:32px;font-weight:950;color:#ffc956;line-height:1.05}.price-bar{display:flex;justify-content:space-between;gap:10px;align-items:center;background:#351058;border-top:1px solid #69348d;color:#fff;padding:10px 14px;font-weight:950}.price-bar b{color:#ffd366}.plan-meta{padding:0 14px 12px}.row{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid rgba(255,255,255,.11);padding:7px 0;color:#e7dff0}.row b{color:#ffd366}.plan-card .btn{margin:0 14px 14px}
    table{width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden}th,td{padding:10px;border-bottom:1px solid #edf2f7;text-align:left}th{background:#f8fafc;color:#64748b;font-size:12px;text-transform:uppercase}.table-wrap{overflow:auto;max-height:360px;border:1px solid #edf2f7;border-radius:8px}.qr{width:210px;max-width:100%;aspect-ratio:1;border:1px dashed #cfd8e5;border-radius:8px;display:grid;place-items:center;overflow:hidden;background:#f8fafc;color:#64748b}.qr img{width:100%;height:100%;object-fit:contain}.toast{position:fixed;right:16px;top:70px;background:#111827;color:#fff;border-radius:8px;padding:12px 14px;display:none;z-index:20;max-width:360px}
    @media(max-width:1024px){.hero{grid-template-columns:1fr;min-height:auto}.grid{grid-template-columns:repeat(2,1fr)}.feature-row,.timeline,.info-grid,.payment-options,.contact-grid{grid-template-columns:repeat(2,1fr)}.detail-band{grid-template-columns:1fr}.bar{align-items:flex-start}nav{max-width:100%;overflow-x:auto;padding-bottom:2px}.product-box{min-height:230px}.home-image img{max-height:460px}}@media(max-width:640px){body{font-size:15px}.bar{display:grid;grid-template-columns:1fr;gap:10px;padding:10px 12px}.brand-copy strong{font-size:20px}.brand-copy small{display:none}.brand span{width:32px;height:32px}nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;width:100%;overflow:visible;padding:6px}.btn,nav button{min-height:40px;padding:8px 9px;font-size:14px;white-space:normal}.hero,.grid,.two,.home-stats,.feature-row,.detail-band,.timeline,.info-grid,.stat-list,.payment-options,.home-plans,.contact-grid,.wallet-support-layout,.payment-flow,.auth-options{grid-template-columns:1fr}.hero{padding:18px;gap:14px;min-height:auto}.hero h1{font-size:34px;line-height:1.04}.hero-lead{font-size:16px;line-height:1.55}.actions{display:grid;grid-template-columns:1fr}.actions .btn,.actions button{width:100%}.mini-grid{grid-template-columns:1fr}.wallet-top{display:grid}.wallet-amount{font-size:30px}.home-image{padding:7px}.home-image-caption{display:grid}.quick{grid-template-columns:repeat(2,1fr)}.quick button{min-height:58px;font-size:13px}.filters{grid-template-columns:1fr}.filters button{min-height:42px}.product-box{min-height:220px}.product-content,.svip-card .product-content{padding-top:82px}.product-title{font-size:28px}.plan-summary{grid-template-columns:1fr;text-align:center;margin:-12px 10px 0}.plan-number{margin:auto}.income-value{font-size:28px}.price-bar,.row{align-items:flex-start}.form{margin:10px 0;max-width:none}.table-wrap{max-height:none}.contact-footer{grid-template-columns:1fr;padding:12px}.contact-grid{grid-column:auto}.contact-visual img{aspect-ratio:16/6;max-height:220px}.toast{left:12px;right:12px;top:auto;bottom:14px;max-width:none}}
  </style>
</head>
<body>
  <header><div class="bar"><div class="brand" onclick="go('home')" role="button" tabindex="0"><span>L</span><div class="brand-copy"><strong>Legacy</strong><small>Premium VIP Platform</small></div></div><nav id="nav"></nav></div></header>
  <main>
    <section id="home" class="page active"><div class="hero"><div><div class="eyebrow">SVIP-style wallet, UTR, plans and admin system</div><h1>Legacy premium VIP and SVIP income platform.</h1><p class="muted hero-lead">A complete production version with server-side accounts, recharge QR, automatic UTR numbers, payment complaints, referral codes, wallet history, and admin controls.</p><div class="actions"><button class="btn primary" onclick="openAuthPopup()">Create Account</button><button class="btn warn" onclick="go('plans')">View Products</button><button class="btn" onclick="go('recharge')">Recharge</button></div><div class="home-stats"><div class="home-stat"><div class="label">Starting Plan</div><div class="value">Rs 550</div></div><div class="home-stat"><div class="label">Top Plan</div><div class="value">Rs 18K</div></div><div class="home-stat"><div class="label">Daily Income</div><div class="value">100 Days</div></div></div></div><div class="hero-preview"><div class="home-svip-showcase"><img src="/assets/svip-product-card-box.png" alt="SVIP premium product image"><div class="home-svip-overlay"><span>SVIP PRODUCT</span><strong>LEGACY SVIP</strong><span>PREMIUM PLAN</span></div></div><div class="home-svip-summary"><div class="home-svip-badge">S</div><div><small>Daily income up to</small><strong>Rs 800 / Day</strong></div></div><div class="wallet-card"><div class="wallet-top"><div><div class="label" style="color:#aab6c8">Wallet Balance</div><div class="wallet-amount" id="heroBalance">Rs 0</div></div><button class="btn warn" onclick="go('recharge')">Recharge</button></div></div><div class="mini-grid"><div class="mini-card"><div class="label" style="color:#aab6c8">Active Plan</div><div class="value" id="heroPlan">None</div></div><div class="mini-card"><div class="label" style="color:#aab6c8">Referral Code</div><div class="value" id="heroCode">----</div></div></div><div class="home-plans" id="homePlanPreview"></div></div></div><div class="home-image"><img src="/assets/svip-product-card-box.png" alt="SVIP premium product image"><div class="home-image-caption"><div><div class="label">Recharge & Wallet Preview</div><p class="muted">A different home visual focused on QR, UPI, bank, USDT, wallet balance, and premium account features.</p></div><button class="btn warn" onclick="go('recharge')">Recharge</button></div></div><div class="feature-row"><div class="feature"><b>Instant UTR</b><span>Every recharge generates a unique payment reference.</span></div><div class="feature"><b>Admin QR</b><span>Change payment QR and UPI details anytime.</span></div><div class="feature"><b>Complaints</b><span>Users can report payment issues with UTR details.</span></div><div class="feature"><b>Referrals</b><span>Invite links and bonus tracking are built in.</span></div></div><h2>Everything included</h2><p class="muted">A clearer look at the account, product, and admin features inside Legacy.</p><div class="detail-band"><div class="detail-card"><h3>Member Wallet</h3><p>Create an account, recharge by UPI, bank transfer, or USDT, receive a UTR, and follow wallet changes from the dashboard.</p><ul class="check-list"><li>Recharge history</li><li>Withdrawal requests</li><li>Income and bonus totals</li></ul></div><div class="detail-card"><h3>VIP Products</h3><p>Visitors can compare VIP and SVIP products by investment amount, daily income, total income, validity, and available slots.</p><ul class="check-list"><li>VIP and SVIP filters</li><li>Plan previews</li><li>Fast product purchase</li></ul></div><div class="detail-card"><h3>Admin Control</h3><p>The admin panel manages payment QR, products, balances, transaction approvals, support messages, and payment complaints.</p><ul class="check-list"><li>Edit plans anytime</li><li>Approve transactions</li><li>Review complaints</li></ul></div></div><h2>How it works</h2><div class="timeline"><div class="step"><div class="step-number">1</div><strong>Register</strong><span>Create a member account with mobile number, password, and optional invite code.</span></div><div class="step"><div class="step-number">2</div><strong>Recharge</strong><span>Add wallet balance and keep the generated UTR reference for tracking.</span></div><div class="step"><div class="step-number">3</div><strong>Choose Plan</strong><span>Compare VIP and SVIP products, then activate a plan from wallet balance.</span></div><div class="step"><div class="step-number">4</div><strong>Track Growth</strong><span>Use dashboard, referrals, support, and complaints to manage the account.</span></div></div><h2>Plan details</h2><p class="muted">Quick information users look for before selecting a product.</p><div class="info-grid"><div class="info-card"><strong>VIP Entry Plans</strong><span>Lower price options help new members test the wallet, recharge, and daily income flow before upgrading.</span></div><div class="info-card"><strong>SVIP Premium Plans</strong><span>Higher-tier products show larger daily income, longer tracking value, and limited slot availability.</span></div><div class="info-card"><strong>Daily Income View</strong><span>Each product displays daily income, total return, validity days, plan price, and slot count together.</span></div><div class="info-card"><strong>Recharge First</strong><span>Users add balance, keep the UTR reference, and then buy a product from the available wallet amount.</span></div></div><div class="home-wide"><div class="wallet-support-layout"><div><span class="support-kicker">Secure payment workflow</span><h3>Wallet, payments, and support</h3><p>The home page now explains the full member journey: register, recharge with current QR or payment details, save the UTR, activate a plan, request withdrawal, raise payment complaints, and contact support when something needs review.</p><div class="support-actions"><button class="btn warn" onclick="go('recharge')">Recharge Now</button><button class="btn primary" onclick="go('complaint')">Track UTR</button><button class="btn" onclick="go('support')">Support</button></div></div><div class="stat-list"><div><div class="label">Recharge</div><div class="value">UPI / Bank / USDT</div></div><div><div class="label">Complaint</div><div class="value">UTR Tracking</div></div><div><div class="label">Admin</div><div class="value">Review Panel</div></div></div><div class="payment-flow"><span>Register</span><span>Recharge</span><span>Activate Plan</span><span>Withdraw</span></div></div></div><div class="detail-band"><div class="detail-card"><h3>Referral Team</h3><p>Members get a personal invite code and shareable referral link so new registrations can be connected to their team.</p><ul class="check-list"><li>Auto-filled invite links</li><li>Team member list</li><li>Bonus summary</li></ul></div><div class="detail-card"><h3>Withdrawal Flow</h3><p>Wallet users can submit withdrawal requests with UPI or bank details, and admins can review transaction history.</p><ul class="check-list"><li>Amount validation</li><li>Payment address field</li><li>Dashboard history</li></ul></div><div class="detail-card"><h3>Admin Overview</h3><p>Admins can update QR details, add or edit products, approve payments, manage balances, and check support messages.</p><ul class="check-list"><li>Product controls</li><li>QR and payment settings</li><li>Complaint status updates</li></ul></div></div><div class="contact-footer"><div class="contact-copy"><div><h2>Contact Details</h2><p>Need help with recharge, UTR, withdrawal, products, or account access? Use the support details below.</p></div><div class="actions"><button class="btn primary" onclick="go('support')">Contact Support</button><button class="btn warn" onclick="go('complaint')">Payment Complaint</button></div></div><div class="contact-visual"><img src="/assets/product-card-box.png" alt="VIP product support image"></div><div class="contact-grid"><div class="contact-card"><div class="label">Customer Support</div><strong>support@legacy.app</strong><span>Send account and app questions anytime.</span></div><div class="contact-card"><div class="label">Phone / WhatsApp</div><strong>+91 98765 43210</strong><span>Quick help for recharge and withdrawal issues.</span></div><div class="contact-card"><div class="label">Payment Help</div><strong>UTR Complaint Desk</strong><span>Submit your UTR number when a payment needs review.</span></div><div class="contact-card"><div class="label">Office Hours</div><strong>Mon-Sat, 9 AM - 7 PM</strong><span>Requests are checked during support hours.</span></div></div></div></section>
    <section id="register" class="page"><form class="form" onsubmit="registerUser(event)"><h2>Register</h2><div class="field"><label>Name</label><input id="regName" required></div><div class="field"><label>Mobile</label><input id="regPhone" required></div><div class="field"><label>Password</label><div class="password-row"><input id="regPass" type="password" required><button class="btn" type="button" onclick="togglePassword('regPass', this)">Show</button></div></div><div class="field"><label>Invite Code</label><input id="regRef"></div><button class="btn primary" style="width:100%">Register</button></form></section>
    <section id="login" class="page"><form class="form" onsubmit="loginUser(event)"><h2>Login</h2><div class="field"><label>Mobile</label><input id="loginPhone" required></div><div class="field"><label>Password</label><div class="password-row"><input id="loginPass" type="password" required><button class="btn" type="button" onclick="togglePassword('loginPass', this)">Show</button></div></div><button class="btn primary" style="width:100%">Login</button></form></section>
    <section id="dashboard" class="page"><div class="actions" style="justify-content:space-between"><h2>Dashboard</h2><button class="btn danger" onclick="logout()">Logout</button></div><div class="grid"><div class="card"><div class="label">Balance</div><div class="value" id="dashBalance">Rs 0</div></div><div class="card"><div class="label">Income</div><div class="value" id="dashIncome">Rs 0</div></div><div class="card"><div class="label">Bonus</div><div class="value" id="dashBonus">Rs 0</div></div></div><div class="card" style="margin-top:14px"><h3>Quick Actions</h3><div class="actions"><button class="btn blue" onclick="go('recharge')">Recharge</button><button class="btn warn" onclick="go('complaint')">Payment Complaint</button><button class="btn" onclick="go('withdraw')">Withdraw</button><button class="btn primary" onclick="go('plans')">Buy Plan</button></div></div><h2>Transactions</h2><div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>UTR</th><th>Status</th></tr></thead><tbody id="txRows"></tbody></table></div></section>
    <section id="plans" class="page"><h2>Products & Plans</h2><p class="muted">Investment plans start from Rs 550 and go up to Rs 18,000.</p><div class="quick"><button onclick="go('recharge')">Recharge</button><button onclick="go('withdraw')">Withdraw</button><button onclick="go('support')">Channels</button><button onclick="go('dashboard')">Online</button></div><div class="filters"><button class="btn active" data-filter="ALL" onclick="setFilter('ALL')">All</button><button class="btn" data-filter="VIP" onclick="setFilter('VIP')">VIP Plan</button><button class="btn" data-filter="SVIP" onclick="setFilter('SVIP')">SVIP Plan</button></div><div class="detail-band"><div class="detail-card"><h3>VIP Plan Details</h3><p>VIP products are starter-to-premium options with visible daily income, total income, validity days, and available slots.</p></div><div class="detail-card"><h3>SVIP Plan Details</h3><p>SVIP products highlight higher-tier packages and limited slots while keeping the same simple invest, earn, and track workflow.</p></div><div class="detail-card"><h3>Before You Invest</h3><p>Recharge first, keep your UTR number, check the product amount, and use Payment Complaint if a transaction needs review.</p></div></div><div class="grid" id="planGrid"></div></section>
    <section id="recharge" class="page"><form class="form" onsubmit="recharge(event)"><h2>Recharge</h2><div class="qr" id="qrBox">No QR added</div><div class="payment-options"><div class="payment-option active" data-method="QR Code" role="button" tabindex="0" onclick="selectPaymentMethod('QR Code')" onkeydown="paymentKey(event,'QR Code')"><strong>QR Code</strong><span>Scan the current QR image and submit recharge.</span></div><div class="payment-option" data-method="UPI" role="button" tabindex="0" onclick="selectPaymentMethod('UPI')" onkeydown="paymentKey(event,'UPI')"><strong>UPI</strong><span>Use the payment detail or UPI ID shown below.</span></div><div class="payment-option" data-method="Bank Transfer" role="button" tabindex="0" onclick="selectPaymentMethod('Bank Transfer')" onkeydown="paymentKey(event,'Bank Transfer')"><strong>Bank</strong><span>Send by bank transfer and keep your reference.</span></div><div class="payment-option" data-method="USDT" role="button" tabindex="0" onclick="selectPaymentMethod('USDT')" onkeydown="paymentKey(event,'USDT')"><strong>USDT</strong><span>Use crypto payment details if enabled by admin.</span></div></div><div class="field"><label>UPI / Bank / USDT Detail</label><input id="paymentDetail" readonly></div><div class="field"><label>Amount</label><input id="rechargeAmount" type="number" min="100" value="1000" required></div><div class="field"><label>Payment Method</label><select id="rechargeMethod" onchange="selectPaymentMethod(this.value)"><option>QR Code</option><option>UPI</option><option>Bank Transfer</option><option>USDT</option></select></div><button class="btn primary" style="width:100%">Complete Payment</button><button class="btn" type="button" style="width:100%;margin-top:10px" onclick="go('complaint')">Payment Issue Complaint</button></form></section>
    <section id="withdraw" class="page"><form class="form" onsubmit="withdraw(event)"><h2>Withdraw</h2><div class="field"><label>Amount</label><input id="withdrawAmount" type="number" min="100" required></div><div class="field"><label>UPI / Bank Detail</label><input id="withdrawTo" required></div><button class="btn warn" style="width:100%">Request Withdraw</button></form></section>
    <section id="complaint" class="page"><form class="form" onsubmit="complaint(event)"><h2>Payment Complaint</h2><div class="field"><label>UTR</label><input id="cmpUtr"></div><div class="field"><label>Amount</label><input id="cmpAmount" type="number" required></div><div class="field"><label>Method</label><select id="cmpMethod"><option>UPI</option><option>Bank Transfer</option><option>USDT</option><option>Other</option></select></div><div class="field"><label>Issue</label><select id="cmpIssue"><option>Payment done but balance not added</option><option>Wrong UTR generated</option><option>QR/payment detail issue</option><option>Recharge pending</option><option>Other payment issue</option></select></div><div class="field"><label>Message</label><textarea id="cmpMessage" required></textarea></div><button class="btn warn" style="width:100%">Submit Complaint</button></form></section>
    <section id="support" class="page"><form class="form" onsubmit="support(event)"><h2>Support</h2><div class="field"><label>Subject</label><input id="supportSubject" required></div><div class="field"><label>Message</label><textarea id="supportMessage" required></textarea></div><button class="btn primary" style="width:100%">Send</button></form></section>
    <section id="referrals" class="page"><h2>Team & Invite</h2><div class="card"><div class="label">Your Code</div><div class="value" id="refCode">----</div><div class="field"><label>Referral Link</label><input id="refLink" readonly></div></div></section>
    <section id="admin-login" class="page"><form class="form" onsubmit="adminLogin(event)"><h2>Admin Login</h2><p class="muted">Default password: admin123. Set ADMIN_PASSWORD for production.</p><div class="field"><label>Password</label><div class="password-row"><input id="adminPass" type="password" required><button class="btn" type="button" onclick="togglePassword('adminPass', this)">Show</button></div></div><button class="btn danger" style="width:100%">Open Admin</button></form></section>
    <section id="admin" class="page"><div class="actions" style="justify-content:space-between"><h2>Admin Panel</h2><button class="btn danger" onclick="logout()">Logout</button></div><div class="grid"><div class="card"><div class="label">Users</div><div class="value" id="adminUsers">0</div></div><div class="card"><div class="label">Plans</div><div class="value" id="adminPlans">0</div></div><div class="card"><div class="label">Transactions</div><div class="value" id="adminTx">0</div></div></div><div class="grid two" style="margin-top:14px"><form class="card" onsubmit="saveSettings(event)"><h3>QR & Payment</h3><div class="field"><label>Payment Detail</label><input id="adminPayment"></div><div class="field"><label>Upload QR</label><input id="adminQr" type="file" accept="image/*"></div><button class="btn primary">Save Settings</button></form><form class="card" onsubmit="savePlan(event)"><h3>Add/Edit Product</h3><input id="planOriginal" type="hidden"><div class="grid two"><div class="field"><label>Name</label><input id="planName" required></div><div class="field"><label>Type</label><select id="planType"><option>VIP</option><option>SVIP</option></select></div><div class="field"><label>Price</label><input id="planPrice" type="number" min="550" max="18000" required></div><div class="field"><label>Daily</label><input id="planDaily" type="number" required></div><div class="field"><label>Total</label><input id="planTotal" type="number" required></div><div class="field"><label>Days</label><input id="planDays" type="number" value="100"></div><div class="field"><label>Slots</label><input id="planSlots" type="number" value="10"></div></div><button class="btn primary">Save Product</button></form></div><h2>Products</h2><div class="table-wrap"><table><thead><tr><th>Name</th><th>Type</th><th>Price</th><th>Daily</th><th>Action</th></tr></thead><tbody id="adminPlanRows"></tbody></table></div><h2>Transactions</h2><div class="table-wrap"><table><thead><tr><th>Date</th><th>User</th><th>Type</th><th>Amount</th><th>UTR</th><th>Status</th><th>Action</th></tr></thead><tbody id="adminTxRows"></tbody></table></div><h2>Payment Complaints</h2><div class="table-wrap"><table><thead><tr><th>Date</th><th>User</th><th>UTR</th><th>Amount</th><th>Issue</th><th>Status</th><th>Action</th></tr></thead><tbody id="adminComplaintRows"></tbody></table></div><h2>Users</h2><div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>Balance</th><th>Plan</th><th>Action</th></tr></thead><tbody id="adminUserRows"></tbody></table></div><div class="card" style="margin-top:14px"><button class="btn danger" onclick="resetSystem()">Reset System</button></div></section>
  </main><div class="auth-popup" id="authPopup" onclick="popupBackdrop(event)"><div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="authPopupTitle"><div class="auth-dialog-head"><div><h2 id="authPopupTitle">Welcome to Legacy</h2><p>Create a new account or login to continue with wallet, recharge, products, and dashboard.</p></div><button class="btn auth-close" type="button" onclick="closeAuthPopup()" aria-label="Close">&times;</button></div><div class="auth-options"><button class="auth-option" type="button" onclick="chooseAuth('register')"><strong>Create Account</strong><span>Start with mobile, password, and invite code.</span></button><button class="auth-option" type="button" onclick="chooseAuth('login')"><strong>Login</strong><span>Open your wallet, products, and income dashboard.</span></button></div></div></div><div id="toast" class="toast"></div>
<script>
let app={user:null,admin:false,plans:[],settings:{},transactions:[],investments:[],complaints:[]};let filter='ALL';const rs=n=>'Rs '+Number(n||0).toLocaleString('en-IN');const dailyIncome=p=>Number(p.daily||p.price||0);const toast=m=>{const t=document.getElementById('toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2600)};async function api(url,data){const r=await fetch(url,{method:data?'POST':'GET',headers:{'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});const j=await r.json();if(!r.ok)throw new Error(j.error||'Error');return j}
async function load(){app=await api('/api/state');render()}function togglePassword(inputId,button){const input=document.getElementById(inputId);if(!input)return;const hidden=input.type==='password';input.type=hidden?'text':'password';button.textContent=hidden?'Hide':'Show';button.setAttribute('aria-label',hidden?'Hide password':'Show password')}function selectPaymentMethod(method){const select=document.getElementById('rechargeMethod')||document.getElementById('payMethod');if(select)select.value=method;document.querySelectorAll('#recharge .payment-option').forEach(card=>card.classList.toggle('active',card.dataset.method===method))}function paymentKey(event,method){if(event.key==='Enter'||event.key===' '){event.preventDefault();selectPaymentMethod(method)}}function openAuthPopup(){const popup=document.getElementById('authPopup');if(popup)popup.classList.add('active')}function closeAuthPopup(){const popup=document.getElementById('authPopup');if(popup)popup.classList.remove('active')}function popupBackdrop(event){if(event.target&&event.target.id==='authPopup')closeAuthPopup()}function chooseAuth(id){closeAuthPopup();go(id)}function go(id){if(['dashboard','recharge','withdraw','complaint','referrals'].includes(id)&&!app.user){toast('Login required');openAuthPopup();return}if(id==='admin'&&!app.admin){id='admin-login'}document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));location.hash=id;render()}
function render(){document.getElementById('nav').innerHTML=app.user?'<button onclick="go(\\'home\\')" data-tab="home">Home</button><button onclick="go(\\'plans\\')" data-tab="plans">Plans</button><button onclick="go(\\'dashboard\\')" data-tab="dashboard">Dashboard</button><button onclick="go(\\'recharge\\')">Recharge</button><button onclick="go(\\'complaint\\')">Complaint</button><button onclick="go(\\'withdraw\\')">Withdraw</button><button onclick="go(\\'referrals\\')" data-tab="referrals">Team</button><button onclick="go(\\'support\\')" data-tab="support">Support</button><button onclick="logout()">Logout</button>':'<button onclick="go(\\'home\\')" data-tab="home">Home</button><button onclick="go(\\'plans\\')" data-tab="plans">Plans</button><button onclick="go(\\'support\\')" data-tab="support">Support</button><button onclick="openAuthPopup()">Login</button><button class="btn primary" onclick="openAuthPopup()">Register</button>';document.getElementById('heroBalance').textContent=rs(app.user?.balance);document.getElementById('heroPlan').textContent=app.user?.plan||'None';document.getElementById('heroCode').textContent=app.user?.code||'----';renderHomePreview();renderPlans();renderUser();renderAdmin();document.getElementById('qrBox').innerHTML=app.settings.qr?'<img src="'+app.settings.qr+'">':'No QR added';document.getElementById('paymentDetail').value=app.settings.paymentDetail||''}
function renderHomePreview(){const picks=[app.plans[0],app.plans[Math.floor(app.plans.length/2)],app.plans[app.plans.length-1]].filter(Boolean);homePlanPreview.innerHTML=picks.map(p=>'<div class="home-plan"><strong>'+p.name+'</strong><div class="label">Invest</div><div>'+rs(p.price)+'</div><div class="label" style="margin-top:6px">Daily Income</div><div>'+rs(dailyIncome(p))+'</div></div>').join('')}
function renderPlans(){document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));const list=filter==='ALL'?app.plans:app.plans.filter(p=>p.type===filter);document.getElementById('planGrid').innerHTML=list.map((p,idx)=>{const number=(p.name.match(/\\d+/)||[''])[0];const colorClass=p.type==='SVIP'?'svip-color-'+(idx%6):'product-color-'+(idx%12);const productImage=p.type==='SVIP'?'/assets/svip-product-card-box.png':'/assets/product-card-box.png';return '<div class="card plan-card '+(p.type==='SVIP'?'svip-card':'')+'"><div class="product-box '+colorClass+'"><img src="'+productImage+'" alt="'+p.name+' product image"><div class="product-content"><div class="brand-small">'+p.type+' PRODUCT</div><div class="product-title">'+p.name+'</div><div class="product-plan">PLAN</div></div></div><div class="plan-summary"><div class="plan-number">'+number+'</div><strong>'+p.name+' PLAN</strong></div><div class="income-panel"><div class="income-label">DAILY INCOME</div><div class="income-value">'+rs(dailyIncome(p))+'</div></div><div class="price-bar"><span>PLAN PRICE</span><b>'+rs(p.price)+'</b></div><div class="plan-meta"><div class="row"><span>Daily income</span><b>'+rs(dailyIncome(p))+'</b></div><div class="row"><span>Total income</span><b>'+rs(p.total)+'</b></div><div class="row"><span>Validity</span><b>'+p.days+' Days</b></div><div class="row"><span>Slots</span><b>'+p.slots+'</b></div></div><button class="btn warn" onclick="buy(\\''+p.name+'\\')">Invest Now</button></div>'}).join('')}function setFilter(f){filter=f;renderPlans()}
function renderUser(){if(!app.user)return;dashBalance.textContent=rs(app.user.balance);dashIncome.textContent=rs(app.user.income);dashBonus.textContent=rs(app.user.bonus);refCode.textContent=app.user.code;refLink.value=location.origin+'/register?ref='+app.user.code;txRows.innerHTML=app.transactions.slice().reverse().map(t=>'<tr><td>'+t.date+'</td><td>'+t.type+'</td><td>'+rs(t.amount)+'</td><td>'+(t.utr||'-')+'</td><td>'+t.status+'</td></tr>').join('')||'<tr><td colspan=5>No transactions</td></tr>'}
async function renderAdmin(){if(!app.admin)return;const db=await api('/api/admin');adminUsers.textContent=db.users.length;adminPlans.textContent=db.plans.length;adminTx.textContent=db.transactions.length;adminPayment.value=db.settings.paymentDetail||'';adminPlanRows.innerHTML=db.plans.map(p=>'<tr><td>'+p.name+'</td><td>'+p.type+'</td><td>'+rs(p.price)+'</td><td>'+rs(p.daily)+'</td><td><button class="btn" onclick="editPlan(\\''+p.name+'\\')">Edit</button><button class="btn danger" onclick="deletePlan(\\''+p.name+'\\')">Delete</button></td></tr>').join('');adminTxRows.innerHTML=db.transactions.slice().reverse().map(t=>{const u=db.users.find(x=>x.id===t.userId);return'<tr><td>'+t.date+'</td><td>'+(u?.phone||'-')+'</td><td>'+t.type+'</td><td>'+rs(t.amount)+'</td><td>'+(t.utr||'-')+'</td><td>'+t.status+'</td><td><button class="btn" onclick="txStatus(\\''+t.id+'\\',\\'success\\')">Approve</button><button class="btn warn" onclick="txStatus(\\''+t.id+'\\',\\'rejected\\')">Reject</button></td></tr>'}).join('');adminComplaintRows.innerHTML=db.complaints.slice().reverse().map(c=>{const u=db.users.find(x=>x.id===c.userId);return'<tr><td>'+c.date+'</td><td>'+(u?.phone||'-')+'</td><td>'+(c.utr||'-')+'</td><td>'+rs(c.amount)+'</td><td>'+c.issue+'</td><td>'+c.status+'</td><td><button class="btn" onclick="complaintStatus(\\''+c.id+'\\',\\'resolved\\')">Resolve</button><button class="btn warn" onclick="complaintStatus(\\''+c.id+'\\',\\'reviewing\\')">Review</button></td></tr>'}).join('');adminUserRows.innerHTML=db.users.map(u=>'<tr><td>'+u.name+'</td><td>'+u.phone+'</td><td>'+rs(u.balance)+'</td><td>'+(u.plan||'-')+'</td><td><button class="btn" onclick="adjustBalance(\\''+u.id+'\\')">Balance</button></td></tr>').join('')}
async function registerUser(e){e.preventDefault();try{await api('/api/register',{name:regName.value,phone:regPhone.value,password:regPass.value,ref:regRef.value});await load();go('dashboard')}catch(e){toast(e.message)}}async function loginUser(e){e.preventDefault();try{await api('/api/login',{phone:loginPhone.value,password:loginPass.value});await load();go('dashboard')}catch(e){toast(e.message)}}async function adminLogin(e){e.preventDefault();try{await api('/api/admin/login',{password:adminPass.value});await load();go('admin')}catch(e){toast(e.message)}}async function logout(){await api('/api/logout',{});await load();go('home')}
async function recharge(e){e.preventDefault();try{const r=await api('/api/recharge',{amount:rechargeAmount.value,method:rechargeMethod.value});toast('Payment complete. UTR: '+r.utr);await load();go('dashboard')}catch(e){toast(e.message)}}async function withdraw(e){e.preventDefault();try{await api('/api/withdraw',{amount:withdrawAmount.value,to:withdrawTo.value});await load();go('dashboard')}catch(e){toast(e.message)}}async function buy(name){try{await api('/api/buy',{name});await load();go('dashboard')}catch(e){toast(e.message)}}async function support(e){e.preventDefault();try{await api('/api/support',{subject:supportSubject.value,message:supportMessage.value});e.target.reset();toast('Support sent')}catch(e){toast(e.message)}}async function complaint(e){e.preventDefault();try{await api('/api/complaint',{utr:cmpUtr.value,amount:cmpAmount.value,method:cmpMethod.value,issue:cmpIssue.value,message:cmpMessage.value});e.target.reset();toast('Complaint submitted');go('dashboard')}catch(e){toast(e.message)}}
async function saveSettings(e){e.preventDefault();let qr=app.settings.qr||'';const f=adminQr.files[0];if(f)qr=await new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result);rd.readAsDataURL(f)});await api('/api/admin/settings',{paymentDetail:adminPayment.value,qr});await load();toast('Settings saved')}async function savePlan(e){e.preventDefault();try{await api('/api/admin/plan',{originalName:planOriginal.value,name:planName.value,type:planType.value,price:planPrice.value,daily:planDaily.value,total:planTotal.value,days:planDays.value,slots:planSlots.value});e.target.reset();planOriginal.value='';await load();toast('Product saved')}catch(e){toast(e.message)}}function editPlan(name){const p=app.plans.find(x=>x.name===name);if(!p)return;planOriginal.value=p.name;planName.value=p.name;planType.value=p.type;planPrice.value=p.price;planDaily.value=p.daily;planTotal.value=p.total;planDays.value=p.days;planSlots.value=p.slots;window.scrollTo(0,0)}async function deletePlan(name){if(confirm('Delete '+name+'?')){await api('/api/admin/delete-plan',{name});await load()}}async function txStatus(id,status){await api('/api/admin/tx-status',{id,status});await load()}async function complaintStatus(id,status){await api('/api/admin/complaint-status',{id,status});await load()}async function adjustBalance(userId){const amount=Number(prompt('Amount to add/subtract','0'));if(amount){await api('/api/admin/user-balance',{userId,amount});await load()}}async function resetSystem(){if(confirm('Reset all production data?')){await api('/api/admin/reset',{});await load();go('home')}}
const params=new URLSearchParams(location.search);if(params.get('ref'))regRef.value=params.get('ref');load().then(()=>{const start=location.pathname.indexOf('admin')>=0?'admin-login':(location.hash.replace('#','')||'home');go(start)});
</script></body></html>`;

const server = http.createServer((req, res) => {
  if (req.url && req.url.startsWith('/assets/reference-products.jpeg')) {
    fs.readFile(referenceProductImage, (err, data) => {
      if (err) return send(res, 404, 'Product image not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return send(res, 200, data, { 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store' });
    });
    return;
  }
  if (req.url && req.url.startsWith('/assets/home-recharge-preview.png')) {
    fs.readFile(homeRechargeImage, (err, data) => {
      if (err) return send(res, 404, 'Home image not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return send(res, 200, data, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
    });
    return;
  }
  if (req.url && req.url.startsWith('/assets/product-card-box.png')) {
    fs.readFile(productCardImage, (err, data) => {
      if (err) return send(res, 404, 'Product card image not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return send(res, 200, data, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
    });
    return;
  }
  if (req.url && req.url.startsWith('/assets/svip-product-card-box.png')) {
    fs.readFile(svipProductCardImage, (err, data) => {
      if (err) return send(res, 404, 'SVIP product card image not found', { 'Content-Type': 'text/plain; charset=utf-8' });
      return send(res, 200, data, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
    });
    return;
  }
  if (req.url.startsWith('/api/')) return handleApi(req, res);
  return send(res, 200, html);
});

server.listen(PORT, () => {
  console.log('');
  console.log('====================================');
  console.log('PRODUCTION SERVER IS RUNNING');
  console.log('====================================');
  console.log('Open: http://localhost:' + PORT);
  console.log('Admin: http://localhost:' + PORT + '/admin');
  console.log('Data: ' + DB_FILE);
  console.log('====================================');
});
