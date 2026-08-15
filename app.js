// ============================================================
// App logic — you shouldn't need to edit this file.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  if (CONFIG.questionText) {
    document.getElementById('question-name').textContent = CONFIG.questionText;
  }
  buildCalendar();
  buildTimeSlots();
  buildActivities();
});

const state = {
  date: null,       // Date object
  dateLabel: null,
  time: null,
  place: null,       // { name, address, lat, lng } or null if skipped
  placeSkipped: false,
};

function goToStep(id) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (id === 'step-yes') spawnHearts();
  if (id === 'step-confirm') renderSummary();
}

// ---------------- STEP 1: runaway "no" button ----------------
function dodge(evt) {
  const btn = document.getElementById('no-btn');
  const wrap = document.querySelector('.no-wrap');
  const row = document.querySelector('.btn-row');
  const rowRect = row.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const maxX = rowRect.width - btnRect.width;
  const maxY = 40; // small vertical wobble range

  const newX = Math.random() * maxX;
  const newY = (Math.random() * maxY) - (maxY / 2);
  const rot = (Math.random() * 16) - 8;

  btn.style.transition = 'transform .18s ease';
  btn.style.transform = `translate(${newX - wrap.offsetLeft}px, ${newY}px) rotate(${rot}deg)`;

  // shrink the yes button's opposite reaction slightly for fun on repeated dodges
  btn.dataset.dodges = (parseInt(btn.dataset.dodges || '0') + 1);
  if (parseInt(btn.dataset.dodges) > 4) {
    btn.textContent = "no (seriously?)";
  }
  if (parseInt(btn.dataset.dodges) > 9) {
    btn.textContent = "ok fine, no.";
  }

  if (evt) evt.preventDefault();
}

function spawnHearts() {
  const emojis = ['💛', '💚', '✨', '💌'];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      h.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 3300);
    }, i * 90);
  }
}

// ---------------- STEP 3: calendar ----------------
let calViewDate = new Date();
calViewDate.setDate(1);

function buildCalendar() {
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month-label');
  grid.innerHTML = '';

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  label.textContent = `${monthNames[calViewDate.getMonth()]} ${calViewDate.getFullYear()}`;

  ['S','M','T','W','T','F','S'].forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay = new Date(calViewDate.getFullYear(), calViewDate.getMonth(), 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(calViewDate.getFullYear(), calViewDate.getMonth() + 1, 0).getDate();

  const today = new Date();
  today.setHours(0,0,0,0);

  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(calViewDate.getFullYear(), calViewDate.getMonth(), d);
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;

    if (thisDate < today) {
      el.classList.add('disabled');
    } else {
      el.onclick = () => selectDate(thisDate, el);
    }

    if (state.date && thisDate.toDateString() === state.date.toDateString()) {
      el.classList.add('selected');
    }

    grid.appendChild(el);
  }
}

function changeMonth(delta) {
  calViewDate.setMonth(calViewDate.getMonth() + delta);
  buildCalendar();
}

function selectDate(dateObj, el) {
  document.querySelectorAll('.cal-day.selected').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  state.date = dateObj;
  state.dateLabel = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('date-next-btn').disabled = false;
}

// ---------------- STEP 4: time ----------------
function buildTimeSlots() {
  const grid = document.getElementById('time-grid');
  grid.innerHTML = '';
  CONFIG.timeSlots.forEach(t => {
    const el = document.createElement('div');
    el.className = 'time-pill';
    el.textContent = t;
    el.onclick = () => selectTime(t, el);
    grid.appendChild(el);
  });
}

function selectTime(t, el) {
  document.querySelectorAll('.time-pill.selected').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  state.time = t;
  document.getElementById('time-next-btn').disabled = false;
}

// ---------------- STEP 5: activity picker ----------------
function buildActivities() {
  const grid = document.getElementById('activity-grid');
  grid.innerHTML = '';

  CONFIG.activities.forEach((a, i) => {
    const el = document.createElement('div');
    el.className = 'activity-card';
    el.innerHTML = `
      <span class="activity-icon">${a.icon}</span>
      <span class="activity-title">${escapeHtml(a.title)}</span>
      <span class="activity-desc">${escapeHtml(a.desc)}</span>
    `;
    el.onclick = () => selectActivity(a, el);
    grid.appendChild(el);
  });
}

function selectActivity(activity, el) {
  document.querySelectorAll('.activity-card.selected').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');

  state.place = { name: activity.title, address: activity.desc };
  state.placeSkipped = false;

  const picked = document.getElementById('place-picked');
  picked.classList.add('active');
  picked.innerHTML = `<b>${activity.icon} ${escapeHtml(activity.title)}</b><br>${escapeHtml(activity.desc)}`;

  document.getElementById('place-next-btn').disabled = false;
}

function skipPlace() {
  document.querySelectorAll('.activity-card.selected').forEach(x => x.classList.remove('selected'));
  state.place = null;
  state.placeSkipped = true;
  const picked = document.getElementById('place-picked');
  picked.classList.add('active');
  picked.innerHTML = `<b>Surprise me</b><br>Leaving the plan up to you.`;
  document.getElementById('place-next-btn').disabled = false;
}

// ---------------- STEP 6: summary + send ----------------
function renderSummary() {
  const box = document.getElementById('summary-box');
  const placeText = state.placeSkipped
    ? "Left up to you"
    : (state.place ? `${state.place.name} — ${state.place.address}` : "Not selected");

  box.innerHTML = `
    <div><b>Date:</b> ${escapeHtml(state.dateLabel || '—')}</div>
    <div><b>Time:</b> ${escapeHtml(state.time || '—')}</div>
    <div><b>Plan:</b> ${escapeHtml(placeText)}</div>
  `;
}

function sendMessage() {
  const btn = document.getElementById('send-btn');
  const statusMsg = document.getElementById('status-msg');

  if (!CONFIG.formspreeEndpoint || CONFIG.formspreeEndpoint.includes('YOUR_FORM_ID')) {
    statusMsg.textContent = "Email sending isn't configured yet — add your Formspree endpoint in config.js.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Sending...";
  statusMsg.textContent = "";

  const payload = {
    subject: "She said yes! 💌",
    date: state.dateLabel,
    time: state.time,
    plan: state.placeSkipped ? "Left up to you" : (state.place ? `${state.place.name} — ${state.place.address}` : "Not selected"),
  };

  fetch(CONFIG.formspreeEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (res.ok) {
        goToStep('step-sent');
      } else {
        throw new Error('Send failed');
      }
    })
    .catch(() => {
      statusMsg.textContent = "Hmm, something went wrong sending that. Please try again.";
      btn.disabled = false;
      btn.textContent = "Send it →";
    });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
