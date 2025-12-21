// AUTO SKIP SETUP
if (localStorage.getItem('save') === 'true') {
  if (location.pathname.includes('index.html')) {
    location.href = 'dashboard.html';
  }
}

// SAVE CONFIG
function saveConfig() {
  window.tempConfig = {
    token: token.value,
    repo: repo.value,
    file: file.value,
    raw: raw.value
  };
  document.getElementById('cookie').classList.remove('hidden');
}

function acceptCookie() {
  Object.entries(window.tempConfig).forEach(([k,v])=>{
    localStorage.setItem(k, v);
  });
  localStorage.setItem('save','true');
  location.href = 'dashboard.html';
}

function rejectCookie() {
  Object.entries(window.tempConfig).forEach(([k,v])=>{
    sessionStorage.setItem(k, v);
  });
  location.href = 'dashboard.html';
}
const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const repo = localStorage.getItem('repo') || sessionStorage.getItem('repo');
const file = localStorage.getItem('file') || sessionStorage.getItem('file');
const raw = localStorage.getItem('raw') || sessionStorage.getItem('raw');

const apiUrl = `https://api.github.com/repos/${repo}/contents/${file}`;

const headers = {
  Authorization: `token ${token}`,
  Accept: 'application/vnd.github.v3+json'
};

async function loadDB() {
  const res = await fetch(apiUrl, { headers });
  const json = await res.json();
  const content = JSON.parse(atob(json.content));
  window.sha = json.sha;
  window.db = content.dbnya || [];
  document.getElementById('db').textContent = window.db.join('\n');
}

async function updateDB(newDB, msg) {
  await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: msg,
      content: btoa(JSON.stringify({ dbnya: newDB }, null, 2)),
      sha: window.sha
    })
  });
  loadDB();
}

function addUser() {
  if (!db.includes(number.value)) {
    db.push(number.value);
    updateDB(db, `add ${number.value}`);
  }
}

function delUser() {
  updateDB(db.filter(x=>x!==number.value), `delete ${number.value}`);
}

function delAll() {
  updateDB([], 'delete all');
}

function clearStorage() {
  localStorage.clear();
  sessionStorage.clear();
  location.href = 'index.html';
}