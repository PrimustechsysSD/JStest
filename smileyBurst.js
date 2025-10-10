(() => {
  // If already injected, just reopen
  if (window.__sfMenu && typeof window.__sfMenu.showModal === 'function') {
    try { window.__sfMenu.showModal(); } catch {}
    return;
  }

  // Basic styles
  const style = document.createElement('style');
  style.textContent = `
    #sf-menu { max-width: 520px; width: 92%; border: 0; border-radius: 12px; padding: 1rem 1.25rem;
               box-shadow: 0 10px 28px rgba(0,0,0,.25); font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
    #sf-menu::backdrop { background: rgba(0,0,0,.4); }
    #sf-menu h2 { margin: 0 0 .5rem; font-size: 1.1rem; }
    .sf-row { display: flex; flex-direction: column; gap: .5rem; }
    .sf-actions { display: flex; gap: .5rem; justify-content: flex-end; margin-top: .75rem; }
    .sf-btn { border: 1px solid #d0d7de; background: #fff; border-radius: 8px; padding: .5rem .75rem; cursor: pointer; }
    .sf-primary { background: #0b5fff; color: #fff; border-color: #0b5fff; }
    .sf-input { width: 100%; padding: .5rem .6rem; border-radius: 8px; border: 1px solid #d0d7de; }
    .sf-list button { text-align: left; }
  `;
  document.head.appendChild(style);

  // Dialog shell
  const dlg = document.createElement('dialog');
  dlg.id = 'sf-menu';
  dlg.setAttribute('aria-labelledby', 'sf-title');

  const form = document.createElement('form');
  form.method = 'dialog';

  const title = document.createElement('h2');
  title.id = 'sf-title';
  title.textContent = 'What would you like to do?';

  const content = document.createElement('div');
  content.className = 'sf-row';

  const actions = document.createElement('div');
  actions.className = 'sf-actions';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'submit';
  closeBtn.className = 'sf-btn';
  closeBtn.textContent = 'Close';

  actions.appendChild(closeBtn);
  form.append(title, content, actions);
  dlg.appendChild(form);
  document.body.appendChild(dlg);

  // Views
  function showRoot() {
    content.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'sf-row sf-list';

    const b1 = document.createElement('button');
    b1.type = 'button';
    b1.className = 'sf-btn sf-primary';
    b1.textContent = 'Recruiting';

    const b2 = document.createElement('button');
    b2.type = 'button';
    b2.className = 'sf-btn';
    b2.textContent = 'Report Center';

    const b3 = document.createElement('button');
    b3.type = 'button';
    b3.className = 'sf-btn';
    b3.textContent = 'Employee profile';

    list.append(b1, b2, b3);
    content.append(list);

    b1.addEventListener('click', showRecruiting);
    b2.addEventListener('click', () => { title.textContent = 'Report Center (coming soon)'; });
    b3.addEventListener('click', () => { title.textContent = 'Employee profile (coming soon)'; });
    b1.focus();
    title.textContent = 'What would you like to do?';
  }

  function showRecruiting() {
    content.innerHTML = '';
    title.textContent = 'Recruiting';

    const list = document.createElement('div');
    list.className = 'sf-row sf-list';

    const reqBtn = document.createElement('button');
    reqBtn.type = 'button';
    reqBtn.className = 'sf-btn sf-primary';
    reqBtn.textContent = 'Requisition';

    const candBtn = document.createElement('button');
    candBtn.type = 'button';
    candBtn.className = 'sf-btn';
    candBtn.textContent = 'Candidate search';

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'sf-btn';
    back.textContent = 'Back';

    list.append(reqBtn, candBtn, back);
    content.append(list);

    reqBtn.addEventListener('click', showReqSearch);
    candBtn.addEventListener('click', () => { title.textContent = 'Candidate search (coming soon)'; });
    back.addEventListener('click', showRoot);
    reqBtn.focus();
  }

  function showReqSearch() {
    content.innerHTML = '';
    title.textContent = 'Requisition search';

    const label = document.createElement('label');
    label.textContent = 'Enter requisition number:';

    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'numeric';
    input.className = 'sf-input';
    input.placeholder = 'e.g., 3322';

    const go = document.createElement('button');
    go.type = 'button';
    go.className = 'sf-btn sf-primary';
    go.textContent = 'Open';

    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'sf-btn';
    back.textContent = 'Back';

    const row = document.createElement('div');
    row.className = 'sf-row';
    row.append(label, input);

    const btns = document.createElement('div');
    btns.className = 'sf-actions';
    btns.append(back, go);

    content.append(row, btns);

    back.addEventListener('click', showRecruiting);
    go.addEventListener('click', () => {
      const num = (input.value || '').trim();
      if (!num) { input.focus(); return; }
      // Base URL with recruiting_mode placeholder value
      const base = 'https://hcm-eu10-sales.hr.cloud.sap/acme?fbacme_o=recruiting&_s.crb=wyvV6FqaQhE5oiWjABiSL2DMqAK%2bkRuyhLkXmFv441Y%3d&recruiting_os=jobreqDetail&recruiting_ns=jobreqDetail&recruiting_mode=3322';
      const u = new URL(base);
      u.searchParams.set('recruiting_mode', String(num));
      window.location.assign(u.toString());
    });

    setTimeout(() => input.focus(), 0);
  }

  // Initialize
  showRoot();
  try { dlg.showModal(); }
  catch { if (typeof dlg.show === 'function') dlg.show(); }

  window.__sfMenu = dlg;
})();
