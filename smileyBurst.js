(() => {
  // Reopen if already injected
  if (window.__sfQuickNavV3?.open) {
    try { window.__sfQuickNavV3.showModal(); } catch {}
    return;
  }

  // ---------------- Theme & Animations ----------------
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sf-surface: #121826;
      --sf-fg: #e6edf3;
      --sf-muted: #a9b4c0;
      --sf-accent: #5b8cff;
      --sf-radius: 14px;
      --sf-ease: cubic-bezier(.22,.61,.36,1);
      --sf-dur: 220ms;
      --sf-backdrop: rgba(9, 14, 23, 0.06);
    }

    dialog#sf-quicknav3 {
      width: min(720px, 96vw);
      margin: 0;
      padding: 0;
      border: none;
      border-radius: var(--sf-radius);
      color: var(--sf-fg);
      background:
        radial-gradient(900px 500px at 0% -10%, rgba(91,140,255,.10), transparent 60%),
        radial-gradient(800px 500px at 120% 120%, rgba(122,92,255,.10), transparent 55%),
        linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)),
        var(--sf-surface);
      box-shadow: 0 18px 60px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.25);
      transform: translateY(10px) scale(.99);
      opacity: 0;
      transition: transform var(--sf-dur) var(--sf-ease), opacity var(--sf-dur) var(--sf-ease);
      overflow: clip;
      z-index: 2147483647;
      position: fixed;           /* allow manual positioning for drag */
      inset: auto auto auto auto;
    }
    dialog#sf-quicknav3[open] { transform: translateY(0) scale(1); opacity: 1; }
    dialog#sf-quicknav3::backdrop {
      background: var(--sf-backdrop);
      backdrop-filter: blur(2px);
    }

    .sfq3-header {
      padding: 12px 14px 8px;
      display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      cursor: move;                          /* drag handle */
      user-select: none;
    }
    .sfq3-title { margin: 0; font-size: 16px; letter-spacing: .2px; }
    .sfq3-close { appearance: none; border: none; background: transparent; color: var(--sf-muted);
      padding: 6px 8px; border-radius: 8px; cursor: pointer; }
    .sfq3-close:hover { color: var(--sf-fg); background: rgba(255,255,255,.06); }

    .sfq3-body {
      padding: 12px 14px 14px;
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 12px;
      min-height: 260px;
    }

    .sfq3-list { display: grid; gap: 8px; align-content: start; }
    .sfq3-item {
      display: flex; align-items: center; gap: 10px;
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.03);
      border-radius: 12px;
      color: var(--sf-fg);
      padding: 10px 12px;
      cursor: pointer;
      transition: transform 140ms var(--sf-ease), background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
      text-align: left;
    }
    .sfq3-item:hover, .sfq3-item:focus-within {
      background: rgba(255,255,255,.06);
      border-color: rgba(255,255,255,.22);
      box-shadow: 0 6px 18px rgba(91,140,255,.12);
      transform: translateY(-1px);
    }
    .sfq3-item[data-has-details="true"]::after { content: "›"; margin-left: auto; color: var(--sf-muted); }

    .sfq3-detail {
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 12px;
      background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02));
      min-height: 220px;
      padding: 12px;
      position: relative;
      overflow: hidden;
    }
    .sfq3-detail-inner { opacity: 0; transform: translateY(8px); animation: sfq3Slide .20s var(--sf-ease) forwards; }
    @keyframes sfq3Slide { to { opacity: 1; transform: translateY(0); } }

    .sfq3-h { margin: 2px 0 8px; font-size: 15px; }
    .sfq3-p { margin: 0 0 10px; color: var(--sf-muted); font-size: 13px; }

    .sfq3-row { display: grid; gap: 8px; }
    .sfq3-actions { display: flex; gap: 8px; flex-wrap: wrap; }

    .sfq3-btn {
      appearance: none; border-radius: 10px; border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.04); color: var(--sf-fg);
      padding: 8px 11px; cursor: pointer;
      transition: transform 140ms var(--sf-ease), background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    }
    .sfq3-btn:hover {
      background: rgba(255,255,255,.08);
      border-color: rgba(255,255,255,.25);
      box-shadow: 0 6px 18px rgba(122,92,255,.12);
      transform: translateY(-1px);
    }
    .sfq3-btn.primary {
      background: linear-gradient(180deg, color-mix(in oklab, var(--sf-accent) 80%, white 10%), var(--sf-accent));
      border-color: color-mix(in oklab, var(--sf-accent) 85%, white 10%);
      color: white;
    }

    .sfq3-input {
      width: 100%; padding: 10px 12px;
      border-radius: 9px; border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.06); color: var(--sf-fg);
      outline: none;
      transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
      margin-top: 8px;              /* extra spacing from buttons below */
    }
    .sfq3-input:focus {
      border-color: color-mix(in oklab, var(--sf-accent) 80%, white 10%);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--sf-accent) 25%, transparent 75%);
      background: rgba(255,255,255,.08);
    }

    @media (max-width: 640px) {
      .sfq3-body { grid-template-columns: 1fr; }
      .sfq3-detail { min-height: 160px; }
    }
  `;
  document.head.appendChild(style);

  // ---------------- DOM ----------------
  const dlg = document.createElement('dialog');
  dlg.id = 'sf-quicknav3';
  dlg.setAttribute('aria-labelledby', 'sfq3-title');

  const form = document.createElement('form');
  form.method = 'dialog';

  const header = document.createElement('div');
  header.className = 'sfq3-header';

  const title = document.createElement('h2');
  title.className = 'sfq3-title';
  title.id = 'sfq3-title';
  title.textContent = 'Recruiting quick navigation'; // renamed

  const closeBtn = document.createElement('button');
  closeBtn.type = 'submit';
  closeBtn.className = 'sfq3-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close');

  const body = document.createElement('div');
  body.className = 'sfq3-body';

  const left = document.createElement('div');
  left.className = 'sfq3-list';

  const right = document.createElement('div');
  right.className = 'sfq3-detail';

  header.append(title, closeBtn);
  body.append(left, right);
  form.append(header, body);
  dlg.append(form);
  document.body.appendChild(dlg);

  // ---------------- Data & helpers ----------------
  const openNew = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const items = [
    {
      key: 'jobreq',
      label: 'Job Requisitions',
      hasDetails: true,
      summaryUrl: 'https://hcm55preview.sapsf.eu/xi/ui/rcmjobreqsummary/pages/jobReqSummary.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d',
      detailBase: 'https://hcm55preview.sapsf.eu/acme?fbacme_o=recruiting&_s.crb=9VIS1uCr%2bA1WoGavX8Bfn%2br3PgpsPzHvh5geS971D1Y%3d&recruiting_os=jobreqDetail&recruiting_ns=jobreqDetail&recruiting_mode=796'
    },
    // ... keep the rest of your links unchanged ...
  ];

  function detailContentFor(item) {
    const wrap = document.createElement('div');
    wrap.className = 'sfq3-detail-inner';

    if (item.key === 'jobreq') {
      const h = document.createElement('div'); h.className = 'sfq3-h'; h.textContent = 'Job Requisitions';
      const p = document.createElement('div'); p.className = 'sfq3-p'; p.textContent = 'Open the summary page or jump directly to a requisition by ID.';

      const actions = document.createElement('div'); actions.className = 'sfq3-actions';
      const btnSummary = document.createElement('button'); btnSummary.type = 'button'; btnSummary.className = 'sfq3-btn primary'; btnSummary.textContent = 'Open Summary';
      btnSummary.addEventListener('click', () => openNew(item.summaryUrl));

      const btnById = document.createElement('button'); btnById.type = 'button'; btnById.className = 'sfq3-btn'; btnById.textContent = 'Open by ID';

      const idInput = document.createElement('input');
      idInput.type = 'text';
      idInput.inputMode = 'numeric';
      idInput.placeholder = 'Requisition ID (e.g., 796)';
      idInput.className = 'sfq3-input';

      const openById = () => {
        const id = (idInput.value || '').trim();
        if (!id) { idInput.focus(); return; }
        const u = new URL(item.detailBase);
        u.searchParams.set('recruiting_mode', String(id));
        openNew(u.toString());
      };

      btnById.addEventListener('click', openById);
      idInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); openById(); }
      });

      actions.append(btnSummary, btnById);
      wrap.append(h, p, actions, idInput); // input placed after actions -> more spacing
      setTimeout(() => idInput.focus(), 0);
      return wrap;
    }

    const h = document.createElement('div'); h.className = 'sfq3-h'; h.textContent = item.label;
    const p = document.createElement('div'); p.className = 'sfq3-p'; p.textContent = 'Open this destination in a new tab.';
    const actions = document.createElement('div'); actions.className = 'sfq3-actions';
    const btnOpen = document.createElement('button'); btnOpen.type = 'button'; btnOpen.className = 'sfq3-btn primary'; btnOpen.textContent = 'Open';
    btnOpen.addEventListener('click', () => openNew(item.url));
    actions.append(btnOpen);
    wrap.append(h, p, actions);
    return wrap;
  }

  const rightEmpty = () => {
    const wrap = document.createElement('div');
    wrap.className = 'sfq3-detail-inner';
    const h = document.createElement('div'); h.className = 'sfq3-h'; h.textContent = 'Hover an option to see details';
    const p = document.createElement('div'); p.className = 'sfq3-p'; p.textContent = 'Use Enter in the ID field to jump directly.';
    wrap.append(h, p);
    return wrap;
  };

  function renderList() {
    left.replaceChildren();
    items.forEach(item => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sfq3-item';
      b.textContent = item.label;
      if (item.hasDetails) b.dataset.hasDetails = 'true';
      const show = () => { right.replaceChildren(detailContentFor(item)); };
      b.addEventListener('mouseenter', show);
      b.addEventListener('focus', show);
      b.addEventListener('click', () => {
        if (item.key === 'jobreq') openNew(item.summaryUrl);
        else if (item.url) openNew(item.url);
      });
      left.appendChild(b);
    });
  }

  // ---------------- Draggable behavior ----------------
  // Drag via header; store position while dialog is open
  (function makeDraggable() {
    let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;

    const getRect = () => dlg.getBoundingClientRect();

    const onDown = (e) => {
      // Only left button or touch
      if (e.type === 'mousedown' && e.button !== 0) return;
      dragging = true;
      const r = getRect();
      startLeft = r.left;
      startTop = r.top;
      startX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      startY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const y = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      const dx = x - startX, dy = y - startY;
      dlg.style.left = Math.max(8, startLeft + dx) + 'px';
      dlg.style.top  = Math.max(8, startTop + dy) + 'px';
      dlg.style.right = 'auto';
      dlg.style.bottom = 'auto';
    };
    const onUp = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };

    header.addEventListener('mousedown', onDown);
    header.addEventListener('touchstart', onDown, { passive: false });

    // Start near top-left with a pleasant offset
    dlg.addEventListener('close', () => {
      dlg.style.left = '';
      dlg.style.top = '';
    });
  })();

  // ---------------- Init ----------------
  renderList();
  right.replaceChildren(rightEmpty());
  try { dlg.showModal(); } catch { if (typeof dlg.show === 'function') dlg.show(); }
  window.__sfQuickNavV3 = dlg;
})();
