(() => {
  // Reopen if already injected
  if (window.__sfHowdy && typeof window.__sfHowdy.showModal === 'function') {
    try { window.__sfHowdy.showModal(); } catch {}
    return;
  }

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    #sf-howdy {
      max-width: 420px; width: 90%;
      border: 0; border-radius: 12px; padding: 1rem 1.25rem;
      box-shadow: 0 10px 28px rgba(0,0,0,.25);
      font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }
    #sf-howdy::backdrop { background: rgba(0,0,0,.4); }
    .sf-actions { display: flex; gap: .5rem; justify-content: flex-end; margin-top: .75rem; }
    .sf-actions button { border: 1px solid #d0d7de; background: #fff; border-radius: 8px; padding: .5rem .8rem; cursor: pointer; }
    .sf-primary { background: #0b5fff; color: #fff; border-color: #0b5fff; }
  `;
  document.head.appendChild(style);

  // Dialog structure
  const dlg = document.createElement('dialog');
  dlg.id = 'sf-howdy';
  dlg.setAttribute('aria-labelledby', 'sf-howdy-title');

  const form = document.createElement('form');
  form.method = 'dialog';

  const h2 = document.createElement('h2');
  h2.id = 'sf-howdy-title';
  h2.textContent = 'Quick check-in';

  const p = document.createElement('p');
  p.id = 'sf-howdy-text';
  p.textContent = 'How are you?';

  const actions = document.createElement('div');
  actions.className = 'sf-actions';

  const ok = document.createElement('button');
  ok.type = 'button';
  ok.className = 'sf-primary';
  ok.autofocus = true;
  ok.textContent = 'I am fine';

  const closeBtn = document.createElement('button');
  closeBtn.type = 'submit';
  closeBtn.textContent = 'Close';

  actions.append(ok, closeBtn);
  form.append(h2, p, actions);
  dlg.append(form);
  document.body.appendChild(dlg);

  ok.addEventListener('click', () => {
    p.textContent = 'Thank you!';
    ok.disabled = true;
    setTimeout(() => {
      window.location.assign('https://www.easemate.ai/webapp/chat?from=ai-chat');
    }, 900);
  });

  try { dlg.showModal(); }
  catch {
    if (typeof dlg.show === 'function') dlg.show(); else alert('How are you?');
  }

  window.__sfHowdy = dlg;
})();
