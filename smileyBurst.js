(() => {
  // Reopen if already injected
  if (window.__sfQuickNav?.open) {
    try { window.__sfQuickNav.showModal(); } catch {}
    return;
  }

  // ---------------- Styles (modern, animated, motion-safe) ----------------
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sf-bg: #0b1220;
      --sf-surface: #121826;
      --sf-fg: #e6edf3;
      --sf-muted: #a9b4c0;
      --sf-accent: #5b8cff;
      --sf-radius: 14px;
      --sf-ease: cubic-bezier(.22,.61,.36,1);
      --sf-dur: 260ms;
      --sf-shadow: 0 18px 60px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.25);
    }
    dialog#sf-quicknav {
      width: min(560px, 96vw);
      margin: 0;
      padding: 0;
      border: none;
      border-radius: var(--sf-radius);
      color: var(--sf-fg);
      background:
        radial-gradient(1200px 600px at 10% -10%, rgba(91,140,255,.12), transparent 60%),
        radial-gradient(1000px 600px at 110% 110%, rgba(122,92,255,.12), transparent 50%),
        var(--sf-surface);
      box-shadow: var(--sf-shadow);
      transform: translateY(18px) scale(.98);
      opacity: 0;
      transition: transform var(--sf-dur) var(--sf-ease), opacity var(--sf-dur) var(--sf-ease);
      will-change: transform, opacity;
      overflow: clip;
      z-index: 2147483647;
    }
    dialog#sf-quicknav[open] { transform: translateY(0) scale(1); opacity: 1; }
    dialog#sf-quicknav::backdrop {
      background: color-mix(in oklab, black 65%, #0b1220 35%);
      backdrop-filter: blur(6px) saturate(1.05);
      transition: background var(--sf-dur) var(--sf-ease), backdrop-filter var(--sf-dur) var(--sf-ease);
    }

    .sfq-header {
      padding: 16px 18px 8px;
      display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      background: linear-gradient(180deg, rgba(255,255,255,.04), transparent);
    }
    .sfq-title { margin: 0; font-size: 16px; letter-spacing: .2px; }
    .sfq-close { appearance: none; border: none; background: transparent; color: var(--sf-muted);
      padding: 6px 8px; border-radius: 8px; cursor: pointer; }
    .sfq-close:hover { color: var(--sf-fg); background: rgba(255,255,255,.06); }

    .sfq-body { padding: 14px 18px 18px; display: grid; gap: 12px; }
    .sfq-list { display: grid; gap: 10px; }
    .sfq-actions { display: flex; gap: 8px; justify-content: flex-end; }

    .sfq-btn {
      display: inline-flex; align-items: center; gap: 10px; width: 100%;
      padding: 10px 12px; border: 1px solid rgba(255,255,255,.10);
      border-radius: 12px; background: rgba(255,255,255,.03); color: var(--sf-fg);
      cursor: pointer; text-align: left;
      transition: transform 140ms var(--sf-ease), background 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
    }
    .sfq-btn:hover { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.20); box-shadow: 0 6px 18px rgba(91,140,255,.12); transform: translateY(-1px); }
    .sfq-primary {
      background: linear-gradient(180deg, color-mix(in oklab, var(--sf-accent) 75%, white 6%), var(--sf-accent));
      border-color: color-mix(in oklab, var(--sf-accent) 85%, white 8%);
      color: white;
    }
    .sfq-input {
      width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.04); color: var(--sf-fg); outline: none;
      transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
    }
    .sfq-input:focus {
      border-color: color-mix(in oklab, var(--sf-accent) 80%, white 10%);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--sf-accent) 25%, transparent 75%);
      background: rgba(255,255,255,.06);
    }
    .sfq-label { color: var(--sf-muted); font-size: 12px; }

    .sfq-view { animation: sfqSlide .26s var(--sf-ease) both; }
    @keyframes sfqSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    @media (prefers-reduced-motion: reduce) {
      dialog#sf-quicknav, dialog#sf-quicknav::backdrop, .sfq-btn, .sfq-view { transition: none !important; animation: none !important; }
    }
  `;
  document.head.appendChild(style);

  // ---------------- Dialog markup ----------------
  const dlg = document.createElement('dialog');
  dlg.id = 'sf-quicknav';
  dlg.setAttribute('aria-labelledby', 'sfq-title');

  const form = document.createElement('form');
  form.method = 'dialog';

  const header = document.createElement('div');
  header.className = 'sfq-header';

  const title = document.createElement('h2');
  title.className = 'sfq-title';
  title.id = 'sfq-title';
  title.textContent = 'Quick navigation';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'submit';
  closeBtn.className = 'sfq-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close');

  const body = document.createElement('div');
  body.className = 'sfq-body';

  header.append(title, closeBtn);
  form.append(header, body);
  dlg.append(form);
  document.body.appendChild(dlg);

  // ---------------- Helpers ----------------
  const openNew = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const LINKS = [
    { label: 'Candidate Offers', url: 'https://hcm55.sapsf.eu/xi/ui/rcmoffer/pages/MassOfferDetailSummary.xhtml' },
    { label: 'Dashboard', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcmdashboard/pages/index.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Sources', url: 'https://hcm55preview.sapsf.eu/acme?fbacme_n=recruiting&itrModule=rcm&recruiting_ns=sourcePortlet&bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Preferences', url: 'https://hcm55preview.sapsf.eu/acme?fbacme_n=recruiting&itrModule=rcm&recruiting_ns=local%20questions&bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Candidates', url: 'https://hcm55preview.sapsf.eu/acme?fbacme_n=recruiting&itrModule=rcm&recruiting_ns=candidate%20search%20standalone&bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Interview Central', url: 'https://hcm55preview.sapsf.eu/sf/recruiting/interviewcentral?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Interview Scheduling', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcminterviewschedule/pages/rcmInterviewScheduling.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Marketing', url: 'https://hcm55preview.sapsf.eu/xi/ui/emailcampaign/pages/index.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Source Tracker', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcmjobs2web/pages/marketing/rmkMarketing.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Advanced Analytics', url: 'https://hcm55preview.sapsf.eu/xi/ui/rcmjobs2web/pages/marketing/rmkAdvancedAnalytics.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' },
    { label: 'Message Center', url: 'https://hcm55preview.sapsf.eu/xi/ui/recruiting/pages/rcmcorrespondence/rcmmessagecenter.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d' }
  ];

  const JOBREQ_SUMMARY = 'https://hcm55preview.sapsf.eu/xi/ui/rcmjobreqsummary/pages/jobReqSummary.xhtml?bplte_company=avasotechpT2&_s.crb=9VIS1uCr%252bA1WoGavX8Bfn%252br3PgpsPzHvh5geS971D1Y%253d';
  const JOBREQ_DETAIL_BASE = 'https://hcm55preview.sapsf.eu/acme?fbacme_o=recruiting&_s.crb=9VIS1uCr%2bA1WoGavX8Bfn%2br3PgpsPzHvh5geS971D1Y%3d&recruiting_os=jobreqDetail&recruiting_ns=jobreqDetail&recruiting_mode=796';

  const mount = (node) => body.replaceChildren(node);
  const btn = (text, primary=false) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sfq-btn' + (primary ? ' sfq-primary' : '');
    b.textContent = text;
    return b;
  };

  // ---------------- Views ----------------
  function rootView() {
    title.textContent = 'Quick navigation';
    const wrap = document.createElement('div');
    wrap.className = 'sfq-list sfq-view';

    const jobReq = btn('Job Requisitions', true);
    wrap.appendChild(jobReq);
    jobReq.addEventListener('click', jobReqView);

    // Other links
    for (const link of LINKS) {
      const b = btn(link.label);
      b.addEventListener('click', () => openNew(link.url));
      wrap.appendChild(b);
    }

    mount(wrap);
    jobReq.focus();
  }

  function jobReqView() {
    title.textContent = 'Job Requisitions';
    const wrap = document.createElement('div');
    wrap.className = 'sfq-view';

    const list = document.createElement('div');
    list.className = 'sfq-list';

    const openSummary = btn('Open Job Requisition Summary', true);
    openSummary.addEventListener('click', () => openNew(JOBREQ_SUMMARY));

    const label = document.createElement('div');
    label.className = 'sfq-label';
    label.textContent = 'Or open by Requisition ID';

    const input = document.createElement('input');
    input.className = 'sfq-input';
    input.type = 'text';
    input.inputMode = 'numeric';
    input.placeholder = 'Enter Requisition ID (e.g., 796)';

    const actions = document.createElement('div');
    actions.className = 'sfq-actions';

    const back = btn('Back');
    back.addEventListener('click', rootView);

    const openById = btn('Open by ID', true);
    openById.addEventListener('click', () => {
      const id = (input.value || '').trim();
      if (!id) { input.focus(); return; }
      const u = new URL(JOBREQ_DETAIL_BASE);
      u.searchParams.set('recruiting_mode', String(id));
      openNew(u.toString());
    });

    list.append(openSummary, label, input);
    actions.append(back, openById);

    wrap.append(list, actions);
    mount(wrap);
    setTimeout(() => input.focus(), 0);
  }

  // ---------------- Init ----------------
  rootView();
  try { dlg.showModal(); } catch { if (typeof dlg.show === 'function') dlg.show(); }

  // Expose handle to reopen
  window.__sfQuickNav = dlg;
})();
