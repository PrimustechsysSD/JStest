(() => {
  // Prevent duplicate injection
  if (window.__sfQQ && window.__sfQQ.open) {
    try { window.__sfQQ.showModal(); } catch (_) {}
    return;
  }

  // Styles scoped to this dialog
  const css = `
    #sfqq-dialog {
      max-width: 520px;
      width: 90%;
      border: 0;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      box-shadow: 0 10px 28px rgba(0,0,0,0.25);
      font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    }
    #sfqq-dialog::backdrop { background: rgba(0,0,0,0.4); }
    #sfqq-title { margin: 0 0 0.5rem; font-size: 1.1rem; }
    #sfqq-text { margin: 0.25rem 0 0.75rem; }
    .sfqq-actions { display: flex; gap: .5rem; justify-content: flex-end; }
    .sfqq-actions button {
      appearance: none; border: 1px solid #d0d7de; background: #fff;
      border-radius: 8px; padding: .5rem .8rem; cursor: pointer;
    }
    .sfqq-actions button[type="button"] { background: #0b5fff; color: #fff; border-color: #0b5fff; }
    .sfqq-actions button[type="button"]:hover { filter: brightness(0.95); }
  `;

  // Inject style
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style); // style-src may need to allow inline <style> in strict CSP

  // Build dialog
  const dlg = document.createElement('dialog');
  dlg.id = 'sfqq-dialog';
  dlg.setAttribute('aria-labelledby', 'sfqq-title');

  const form = document.createElement('form');
  form.method = 'dialog';

  const title = document.createElement('h2');
  title.id = 'sfqq-title';
  title.textContent = 'Quick question';

  const text = document.createElement('p');
  text.id = 'sfqq-text';

  const actions = document.createElement('div');
  actions.className = 'sfqq-actions';

  const another = document.createElement('button');
  another.type = 'button';
  another.autofocus = true;
  another.textContent = 'Another';

  const close = document.createElement('button');
  close.type = 'submit';
  close.textContent = 'Close';

  actions.appendChild(another);
  actions.appendChild(close);
  form.appendChild(title);
  form.appendChild(text);
  form.appendChild(actions);
  dlg.appendChild(form);
  document.body.appendChild(dlg);

  const questions = [
    'What is one goal for this week?',
    'Name a tool learned recently.',
    'What is a small win from today?',
    'Which task needs the most focus next?',
    'What is a blocker that can be removed?'
  ];

  function randomIndex(max) { return Math.floor(Math.random() * max); }
  function setRandomQuestion() { text.textContent = questions[randomIndex(questions.length)]; }

  another.addEventListener('click', (e) => { e.preventDefault(); setRandomQuestion(); });

  dlg.addEventListener('close', () => {
    // optional cleanup or reading returnValue
  });

  setRandomQuestion();
  try { dlg.showModal(); } catch {
    // Fallback to modeless if showModal not available or already open
    dlg.show ? dlg.show() : alert(text.textContent);
  }

  window.__sfQQ = dlg;
})();
