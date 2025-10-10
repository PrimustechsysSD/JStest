(() => {
  if (window.__sfMenu && typeof window.__sfMenu.showModal === 'function') {
    try { window.__sfMenu.showModal(); } catch {}
    return;
  }

  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sf-bg: #0b1220;
      --sf-surface: #121826;
      --sf-accent: #5b8cff;
      --sf-accent-2: #7a5cff;
      --sf-text: #e6edf3;
      --sf-muted: #a9b4c0;
      --sf-radius: 14px;
      --sf-shadow: 0 18px 60px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.25);
      --sf-ease: cubic-bezier(.22,.61,.36,1);
      --sf-dur: 260ms;
    }

    dialog#sf-menu {
      width: min(560px, 96vw);
      margin: 0;
      padding: 0;
      border: none;
      border-radius: var(--sf-radius);
      color: var(--sf-text);
      background:
        radial-gradient(1200px 600px at 10% -10%, rgba(91,140,255,.12), transparent 60%) ,
        radial-gradient(1000px 600px at 110% 110%, rgba(122,92,255,.12), transparent 50%) ,
        var(--sf-surface);
      box-shadow: var(--sf-shadow);
      transform: translateY(18px) scale(.98);
      opacity: 0;
      transition: transform var(--sf-dur) var(--sf-ease), opacity var(--sf-dur) var(--sf-ease);
      will-change: transform, opacity;
      overflow: clip;
    }
    dialog#sf-menu[open] {
      transform: translateY(0) scale(1);
      opacity: 1;
    }

    dialog#sf-menu::backdrop {
      background: color-mix(in oklab, black 65%, #0b1220 35%);
      backdrop-filter: blur(6px) saturate(1.1);
      transition: background var(--sf-dur) var(--sf-ease), backdrop-filter var(--sf-dur) var(--sf-ease);
    }

    /* Layout */
    .sf-header {
      padding: 16px 18px 6px 18px;
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      background: linear-gradient(180deg, rgba(255,255,255,.04), transparent);
    }
    .sf-title {
      margin: 0;
      font-size: 16px;
      letter-spacing: .2px;
    }
    .sf-close {
      appearance: none;
      border: none;
      background: transparent;
      color: var(--sf-muted);
      padding: 6px 8px;
      border-radius: 8px;
      cursor: pointer;
      transition: color 160ms ease, background 160ms ease, transform 120ms ease;
    }
    .sf-close:hover { color: var(--sf-text); background: rgba(255,255,255,.06); }
    .sf-close:active { transform: translateY(1px); }

    .sf-body { padding: 14px 18px 18px 18px; display: grid; gap: 12px; }
    .sf-list { display: grid; gap: 10px; }

    .sf-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 12px;
      background: rgba(255,255,255,.03);
      color: var(--sf-text);
      cursor: pointer;
      transition: transform 140ms var(--sf-ease), background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    }
    .sf-btn:hover {
      background: rgba(255,255,255,.06);
      border-color: rgba(255,255,255,.20);
      box-shadow: 0 6px 18px rgba(91,140,255,.12);
      transform: translateY(-1px);
    }
    .sf-btn:active { transform: translateY(0); }

    .sf-primary {
      background: linear-gradient(180deg, color-mix(in oklab, var(--sf-accent) 70%, white 10%), var(--sf-accent));
      border-color: color-mix(in oklab, var(--sf-accent) 80%, white 10%);
      color: white;
    }
    .sf-primary:hover {
      background: linear-gradient(180deg, color-mix(in oklab, var(--sf-accent) 80%, white 10%), var(--sf-accent));
      box-shadow: 0 8px 22px color-mix(in oklab, var(--sf-accent) 70%, black 65%);
    }

    .sf-label { color: var(--sf-muted); font-size: 12px; }
    .sf-input {
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.04);
      color: var(--sf-text);
      outline: none;
      transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
    }
    .sf-input:focus {
      border-color: color-mix(in oklab, var(--sf-accent) 80%, white 10%);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--sf-accent) 25%, transparent 75%);
      background: rgba(255,255,255,.06);
    }

    /* Section slide-in animation */
    .sf-view {
      animation: sfSlide .26s var(--sf-ease) both;
    }
    @keyframes sfSlide {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Motion safety */
    @media (prefers-reduced-motion: reduce) {
      dialog#sf-menu,
      dialog#sf-menu::backdrop,
      .sf-btn,
      .sf-view { transition: none !important; animation: none !important; }
    }
  `;
  document.head.appendChild(style);

  const dlg = document.createElement('dialog');
  dlg.id = 'sf-menu';
  dlg.setAttribute('aria-labelledby', 'sf-title');

  const form = document.createElement('form');
  form.method = 'dialog';

  const header = document.createElement('div');
  header.className = 'sf-header';

  const title = document.createElement('h2');
  title.className = 'sf-title';
  title.id = 'sf-title';
  title.textContent = 'What would you like to do?';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'submit';
  closeBtn.className = 'sf-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '✕';

  const body = document.createElement('div');
  body.className = 'sf-body';

  header.append(title, closeBtn);
  form.append(header, body);
  dlg.append(form);
  document.body.appendChild(dlg);

  function mount(node) { body.replaceChildren(node); }

  function rootView() {
    const wrap = document.createElement('div');
    wrap.className = 'sf-list sf-view';

    const b1 = btn('Recruiting', true);
    const b2 = btn('Report Center');
    const b3 = btn('Employee profile');

    wrap.append(b1, b2, b3);

    b1.addEventListener('click', recruitingView);
    b2.addEventListener('click', () => title.textContent = 'Report Center (coming soon)');
    b3.addEventListener('click', () => title.textContent = 'Employee profile (coming soon)');

    title.textContent = 'What would you like to do?';
    mount(wrap);
    b1.focus();
  }

  function recruitingView() {
    const wrap = document.createElement('div');
    wrap.className = 'sf-list sf-view';

    const req = btn('Requisition', true);
    const cand = btn('Candidate search');
    const back = btn('Back');

    wrap.append(req, cand, back);

    req.addEventListener('click', reqSearchView);
    cand.addEventListener('click', () => title.textContent = 'Candidate search (coming soon)');
    back.addEventListener('click', rootView);

    title.textContent = 'Recruiting';
    mount(wrap);
    req.focus();
  }

  function reqSearchView() {
    const wrap = document.createElement('div');
    wrap.className = 'sf-view';
    const label = document.createElement('div');
    label.className = 'sf-label';
    label.textContent = 'Enter requisition number';

    const input = document.createElement('input');
    input.className = 'sf-input';
    input.type = 'text';
    input.inputMode = 'numeric';
    input.placeholder = 'e.g., 3322';

    const row = document.createElement('div');
    row.className = 'sf-list';
    row.append(label, input);

    const open = btn('Open', true);
    const back = btn('Back');

    const actions = document.createElement('div');
    actions.className = 'sf-list';
    actions.style.gridTemplateColumns = '1fr 1fr';
    actions.append(back, open);

    wrap.append(row, actions);
    title.textContent = 'Requisition search';
    mount(wrap);
    setTimeout(() => input.focus(), 0);

    back.addEventListener('click', recruitingView);
    open.addEventListener('click', () => {
      const num = (input.value || '').trim();
      if (!num) { input.focus(); return; }
      const base = 'https://hcm-eu10-sales.hr.cloud.sap/acme?fbacme_o=recruiting&_s.crb=wyvV6FqaQhE5oiWjABiSL2DMqAK%2bkRuyhLkXmFv441Y%3d&recruiting_os=jobreqDetail&recruiting_ns=jobreqDetail&recruiting_mode=3322';
      const u = new URL(base);
      u.searchParams.set('recruiting_mode', String(num));
      window.location.assign(u.toString());
    });
  }

  function btn(text, primary=false) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sf-btn' + (primary ? ' sf-primary' : '');
    b.textContent = text;
    return b;
  }

  rootView();
  try { dlg.showModal(); } catch { if (typeof dlg.show === 'function') dlg.show(); }
  window.__sfMenu = dlg;
})();
