(() => {
  // Reopen if already injected
  if (window.__sfQuickNavV2?.open) {
    try { window.__sfQuickNavV2.showModal(); } catch {}
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
      --sf-accent-2: #7a5cff;
      --sf-radius: 14px;
      --sf-ease: cubic-bezier(.22,.61,.36,1);
      --sf-dur: 240ms;
      --sf-backdrop: rgba(9, 14, 23, 0.18); /* lighter dim */
    }

    dialog#sf-quicknav2 {
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
      transform: translateY(14px) scale(.985);
      opacity: 0;
      transition: transform var(--sf-dur) var(--sf-ease), opacity var(--sf-dur) var(--sf-ease);
      will-change: transform, opacity;
      overflow: clip;
      z-index: 2147483647;
    }
    dialog#sf-quicknav2[open] { transform: translateY(0) scale(1); opacity: 1; }

    dialog#sf-quicknav2::backdrop {
      background: var(--sf-backdrop);      /* softened transparency */
      backdrop-filter: blur(3px);          /* subtle blur, not blackout */
      transition: background var(--sf-dur) var(--sf-ease), backdrop-filter var(--sf-dur) var(--sf-ease);
    }

    .sfq2-header {
      padding: 14px 16px 8px;
      display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,.06);
    }
    .sfq2-title { margin: 0; font-size: 16px; letter-spacing: .2px; }
    .sfq2-close { appearance: none; border: none; background: transparent; color: var(--sf-muted);
      padding: 6px 8px; border-radius: 8px; cursor: pointer; }
    .sfq2-close:hover { color: var(--sf-fg); background: rgba(255,255,255,.06); }

    .sfq2-body {
      padding: 12px 14px 14px;
      display: grid;
      grid-template-columns: 260px 1fr;     /* left = list, right = details panel */
      gap: 12px;
      min-height: 260px;
    }

    /* Left list */
    .sfq2-list { display: grid; gap: 8px; align-content: start; }
    .sfq2-item {
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
    .sfq2-item:hover, .sfq2-item:focus-within {
      background: rgba(255,255,255,.06);
      border-color: rgba(255,255,255,.22);
      box-shadow: 0 6px 18px rgba(91,140,255,.12);
      transform: translateY(-1px);
    }
    .sfq2-item[data-has-details="true"]::after {
      content: "›";
      margin-left: auto;
      color: var(--sf-muted);
    }

    /* Right details panel */
    .sfq2-detail {
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 12px;
      background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02));
      min-height: 220px;
      padding: 12px;
      position: relative;
      overflow: hidden;
    }
    .sfq2-detail-inner {
      opacity: 0; transform: translateY(8px);
      animation: sfq2Slide .22s var(--sf-ease) forwards;
    }
    @keyframes sfq2Slide { to { opacity: 1; transform: translateY(0); } }

    .sfq2-h { margin: 2px 0 8px; font-size: 15px; }
    .sfq2-p { margin: 0 0 10px; color: var(--sf-muted); font-size: 13px; }

    .sfq2-row { display: grid; gap: 8px; }
    .sfq2-actions { display: flex; gap: 8px; flex-wrap: wrap; }

    .sfq2-btn {
      appearance: none; border-radius: 10px; border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.04); color: var(--sf-fg);
      padding: 8px 11px; cursor: pointer;
      transition: transform 140ms var(--sf-ease), background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    }
    .sfq2-btn:hover {
      background: rgba(255,255,255,.08);
      border-color: rgba(255,255,255,.25);
      box-shadow: 0 6px 18px rgba(122,92,255,.12);
      transform: translateY(-1px);
    }
    .sfq2-btn.primary {
      background: linear-gradient(180deg, color-mix(in oklab, var(--sf-accent) 80%, white 10%), var(--sf-accent));
      border-color: color-mix(in oklab, var(--sf-accent) 85%, white 10%);
      color: white;
    }

    .sfq2-input {
      width: 100%; padding: 9px 10px;
      border-radius: 9px; border: 1px solid rgba(255,255,255,.15);
      background: rgba(255,255,255,.06); color: var(--sf-fg);
      outline: none;
      transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
    }
    .sfq2-input:focus {
      border-color: color-mix(in oklab, var(--sf-accent) 80%, white 10%);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--sf-accent) 25%, transparent 75%);
      background: rgba(255,255,255,.08);
    }

    /* Responsive: stack on narrow screens */
    @media (max-width: 640px) {
      .sfq2-body { grid-template-columns: 1fr; }
      .sfq2-detail { min-height: 160px; }
    }

    /* Motion safety */
    @media (prefers-reduced-motion: reduce) {
      dialog#sf-quicknav2, dialog#sf-quicknav2::backdrop, .sfq2-item, .sfq2-detail-inner { transition: none !important; animation: none !important; }
    }
  `;
  document.head.appendChild(style);

  // ---------------- DOM ----------------
  const dlg = document.createElement('dialog');
  dlg.id = 'sf-quicknav2';
  dlg.setAttribute('aria-labelledby', 'sfq2-title');

  const form = document.createElement('form');
  form.method = 'dialog';

  const header = document.createElement('div');
  header.className = 'sfq2-header';

  const title = document.createElement('h2');
  title.className = 'sfq2-title';
  title.id = 'sfq2-title';
  title.textContent = 'Quick navigation';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'submit';
  closeBtn.className = 'sfq2-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close');

  const body = document.createElement('div');
  body.className = 'sfq2-body';

  const left = document.createElement('div');
  left.className = 'sfq2-list';

  const right = document.createElement('div');
  right.className = 'sfq2-detail';

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
    { key: 'offers', label: 'Candidate Offers', url: 'https://hcm55.sapsf.eu/xi/ui/rcmoffer/pages/MassOfferDetailSummary.xhtml' },
    { key: 'dashboard', label: 'Dashboard', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcmdashboard/pages/index.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'sources', label: 'Sources', url: 'https://hcm55preview.sapsf.eu/acme?fbacme_n=recruiting&itrModule=rcm&recruiting_ns=sourcePortlet&bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'prefs', label: 'Preferences', url: 'https://hcm55preview.sapsf.eu/acme?fbacme_n=recruiting&itrModule=rcm&recruiting_ns=local%20questions&bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'cands', label: 'Candidates', url: 'https://hcm55preview.sapsf.eu/acme?fbacme_n=recruiting&itrModule=rcm&recruiting_ns=candidate%20search%20standalone&bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'ic', label: 'Interview Central', url: 'https://hcm55preview.sapsf.eu/sf/recruiting/interviewcentral?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'sched', label: 'Interview Scheduling', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcminterviewschedule/pages/rcmInterviewScheduling.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'mkt', label: 'Marketing', url: 'https://hcm55preview.sapsf.eu/xi/ui/emailcampaign/pages/index.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'srcTrack', label: 'Source Tracker', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcmjobs2web/pages/marketing/rmkMarketing.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'adv', label: 'Advanced Analytics', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcmjobs2web/pages/marketing/rmkAdvancedAnalytics.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { key: 'msg', label: 'Message Center', url: 'https://hcm55preview.sapsf.eu/xi/ui/recruiting/pages/rcmcorrespondence/rcmmessagecenter.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' }
  ];

  function detailContentEmpty(label = 'Hover an option to see details') {
    const wrap = document.createElement('div');
    wrap.className = 'sfq2-detail-inner';
    const h = document.createElement('div');
    h.className = 'sfq2-h';
    h.textContent = label;
    const p = document.createElement('div');
    p.className = 'sfq2-p';
    p.textContent = 'Move the pointer over an item (or focus with Tab) to preview actions.';
    wrap.append(h, p);
    return wrap;
  }

  function detailContentFor(item) {
    const wrap = document.createElement('div');
    wrap.className = 'sfq2-detail-inner';

    if (item.key === 'jobreq') {
      const h = document.createElement('div');
      h.className = 'sfq2-h';
      h.textContent = 'Job Requisitions';

      const p = document.createElement('div');
      p.className = 'sfq2-p';
      p.textContent = 'Open the summary page or jump directly to a requisition by ID.';

      const actions = document.createElement('div');
      actions.className = 'sfq2-actions';

      const btnSummary = document.createElement('button');
      btnSummary.type = 'button';
      btnSummary.className = 'sfq2-btn primary';
      btnSummary.textContent = 'Open Summary';
      btnSummary.addEventListener('click', () => openNew(item.summaryUrl));

      const row = document.createElement('div');
      row.className = 'sfq2-row';

      const idInput = document.createElement('input');
      idInput.type = 'text';
      idInput.inputMode = 'numeric';
      idInput.placeholder = 'Requisition ID (e.g., 796)';
      idInput.className = 'sfq2-input';

      const btnById = document.createElement('button');
      btnById.type = 'button';
      btnById.className = 'sfq2-btn';
      btnById.textContent = 'Open by ID';
      btnById.addEventListener('click', () => {
        const id = (idInput.value || '').trim();
        if (!id) { idInput.focus(); return; }
        const u = new URL(item.detailBase);
        u.searchParams.set('recruiting_mode', String(id));
        openNew(u.toString());
      });

      actions.append(btnSummary, btnById);
      row.append(idInput);
      wrap.append(h, p, actions, row);
      return wrap;
    }

    // Default single-action preview
    const h = document.createElement('div');
    h.className = 'sfq2-h';
    h.textContent = item.label;

    const p = document.createElement('div');
    p.className = 'sfq2-p';
    p.textContent = 'Open this destination in a new tab.';

    const actions = document.createElement('div');
    actions.className = 'sfq2-actions';

    const btnOpen = document.createElement('button');
    btnOpen.type = 'button';
    btnOpen.className = 'sfq2-btn primary';
    btnOpen.textContent = 'Open';
    btnOpen.addEventListener('click', () => openNew(item.url));

    actions.append(btnOpen);
    wrap.append(h, p, actions);
    return wrap;
  }

  function renderList() {
    left.replaceChildren();
    items.forEach(item => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sfq2-item';
      b.textContent = item.label;
      if (item.hasDetails) b.dataset.hasDetails = 'true';

      // Hover/focus shows details on the right
      const show = () => {
        right.replaceChildren(detailContentFor(item));
        // If details include input, focus it after render for convenience
        if (item.key === 'jobreq') {
          const input = right.querySelector('.sfq2-input');
          if (input) setTimeout(() => input.focus(), 10);
        }
      };
      b.addEventListener('mouseenter', show);
      b.addEventListener('focus', show);

      // Click behavior:
      // - items with details: open the primary action (summary) on click
      // - items with single destination: open link
      b.addEventListener('click', () => {
        if (item.key === 'jobreq') openNew(item.summaryUrl);
        else if (item.url) openNew(item.url);
      });

      left.appendChild(b);
    });
  }

  // Init
  renderList();
  right.replaceChildren(detailContentEmpty());
  try { dlg.showModal(); } catch { if (typeof dlg.show === 'function') dlg.show(); }

  // Expose handle to reopen
  window.__sfQuickNavV2 = dlg;
})();
