(function () {
  'use strict';

  /* ── Modal HTML ── */
  const MODAL = `
    <div id="protectOverlay" class="protect-overlay" role="dialog" aria-modal="true" aria-labelledby="protectTitle">
      <div class="protect-card">
        <div class="protect-icon"><i class="fa-solid fa-lock"></i></div>
        <h3 class="protect-title" id="protectTitle">File Terkunci</h3>
        <p class="protect-desc">File ini bersifat rahasia &amp; privasi.<br>Masukkan password untuk membukanya.</p>
        <div class="protect-input-wrap">
          <input
            type="password"
            id="protectInput"
            class="protect-input"
            placeholder="Masukkan password..."
            autocomplete="off"
            spellcheck="false"
            maxlength="64"
          >
          <button type="button" id="protectToggle" class="protect-toggle" aria-label="Tampilkan/sembunyikan password">
            <i class="fa-solid fa-eye" id="protectEyeIcon"></i>
          </button>
        </div>
        <p class="protect-error" id="protectError">
          <i class="fa-solid fa-circle-xmark"></i> Password salah. Silakan coba lagi.
        </p>
        <div class="protect-actions">
          <button type="button" class="btn btn-outline" id="protectCancel">Batal</button>
          <button type="button" class="btn btn-primary" id="protectSubmit">
            Buka &nbsp;<i class="fa-solid fa-unlock-keyhole"></i>
          </button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', MODAL);

  /* ── SHA-256 helper ── */
  async function sha256(str) {
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(str)
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /* Password stored split → joined at runtime (not plain text in source) */
  let _cached = null;
  async function expected() {
    if (!_cached) {
      _cached = await sha256(
        ['Z','i','z','i','2','6','0','1','0','4','*'].join('')
      );
    }
    return _cached;
  }

  /* ── State ── */
  let pendingUrl = null;

  /* ── Shorthand selectors ── */
  const $  = id => document.getElementById(id);
  const ov = () => $('protectOverlay');

  /* ── Protect all Jobdesk links ── */
  function init() {
    document.querySelectorAll('.detail-block h3').forEach(h3 => {
      if (h3.textContent.trim() !== 'Jobdesk Result File') return;

      /* Lock badge on the heading */
      if (!h3.querySelector('.protect-badge')) {
        h3.insertAdjacentHTML(
          'beforeend',
          ' <span class="protect-badge"><i class="fa-solid fa-lock"></i> Private</span>'
        );
      }

      /* Intercept every file link in the block */
      h3.closest('.detail-block')
        .querySelectorAll('a.file-item')
        .forEach(link => {
          link.addEventListener('click', function (e) {
            /* If already authenticated this session, let link open normally */
            if (sessionStorage.getItem('jd_auth') === '1') return;
            e.preventDefault();
            pendingUrl = this.getAttribute('href');
            openModal();
          });
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Modal open / close ── */
  function openModal() {
    $('protectInput').value = '';
    $('protectError').style.display = 'none';
    $('protectInput').type = 'password';
    $('protectEyeIcon').className = 'fa-solid fa-eye';
    ov().style.display = 'flex';
    requestAnimationFrame(() =>
      requestAnimationFrame(() => ov().classList.add('active'))
    );
    setTimeout(() => $('protectInput').focus(), 160);
  }

  function closeModal() {
    ov().classList.remove('active');
    setTimeout(() => {
      ov().style.display = 'none';
      pendingUrl = null;
    }, 260);
  }

  /* ── Submit handler ── */
  async function handleSubmit() {
    const btn = $('protectSubmit');
    if (btn.disabled) return;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    $('protectError').style.display = 'none';

    /*
     * Open a blank window NOW (synchronous, inside click event) to avoid
     * popup blockers that block window.open called inside async callbacks.
     */
    const newWin = pendingUrl ? window.open('about:blank', '_blank') : null;

    try {
      const inputHash = await sha256($('protectInput').value);
      const ref       = await expected();

      if (inputHash === ref) {
        /* ✅ Correct */
        sessionStorage.setItem('jd_auth', '1');
        if (newWin) newWin.location.href = pendingUrl;
        btn.innerHTML = 'Berhasil! &nbsp;<i class="fa-solid fa-check"></i>';
        btn.classList.add('protect-success');
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = 'Buka &nbsp;<i class="fa-solid fa-unlock-keyhole"></i>';
            btn.classList.remove('protect-success');
          }, 300);
        }, 750);
      } else {
        /* ❌ Wrong */
        if (newWin) newWin.close();
        $('protectError').style.display = 'flex';
        $('protectInput').classList.add('shake');
        $('protectInput').select();
        setTimeout(() => $('protectInput').classList.remove('shake'), 450);
        btn.disabled = false;
        btn.innerHTML = 'Buka &nbsp;<i class="fa-solid fa-unlock-keyhole"></i>';
      }
    } catch (_) {
      if (newWin) newWin.close();
      btn.disabled = false;
      btn.innerHTML = 'Buka &nbsp;<i class="fa-solid fa-unlock-keyhole"></i>';
    }
  }

  /* ── Event delegation ── */
  document.addEventListener('click', function (e) {
    const t = e.target;
    if (t.id === 'protectSubmit'  || t.closest('#protectSubmit'))  handleSubmit();
    if (t.id === 'protectCancel'  || t.closest('#protectCancel'))  closeModal();
    if (t.id === 'protectOverlay' && t === ov())                   closeModal();
    if (t.id === 'protectToggle'  || t.closest('#protectToggle')) {
      const inp = $('protectInput');
      const ico = $('protectEyeIcon');
      if (inp.type === 'password') {
        inp.type = 'text';
        ico.className = 'fa-solid fa-eye-slash';
      } else {
        inp.type = 'password';
        ico.className = 'fa-solid fa-eye';
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (!ov().classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter')  handleSubmit();
  });
})();
